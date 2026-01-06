import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { eq, sql, and, gt } from 'drizzle-orm';
import { protectedProcedure, router } from '../_core/trpc';
import { invokeLLM } from '../_core/llm';
import { getDb, logGeneration } from '../db';
import { processAffiliateLinks } from '../services/affiliateService';
import { users, creditsTransactions } from '../../drizzle/schema';

const GENERATION_COST = 1; // Credits per generation for free/pro users

const generationInputSchema = z.object({
  topic: z.string().min(3).max(500),
  targetAudience: z.string().optional(),
  tone: z.enum(['funny', 'professional', 'casual', 'motivational']).optional(),
});

export const generationRouter = router({
  /**
   * Generate a viral shorts script using Gemini API.
   * Deducts credits from user (except for Pro/Agency users).
   */
  create: protectedProcedure
    .input(generationInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const userPlan = ctx.user.plan || 'free';

      try {
        // ATOMIC CREDIT DEDUCTION WITH TRANSACTION LOGGING
        let creditsUsed = 0;
        let balanceBefore = ctx.user.credits;
        let balanceAfter = ctx.user.credits;

        // Only deduct credits for free/pro users (agency has unlimited)
        if (userPlan !== 'agency') {
          const db = await getDb();
          if (!db) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Database not available',
            });
          }

          await db.transaction(async (tx: any) => {
            // 1. Atomarer Abzug: Update nur wenn credits > 0
            const result = await tx
              .update(users)
              .set({ credits: sql`${users.credits} - ${GENERATION_COST}` })
              .where(and(eq(users.id, userId), gt(users.credits, 0)));

            // 2. Prüfung
            const affectedRows = Array.isArray(result)
              ? result[0]?.affectedRows
              : (result as any).affectedRows;

            if (!result || affectedRows === 0) {
              throw new TRPCError({
                code: 'PRECONDITION_FAILED',
                message: `Nicht genügend Credits. Sie haben ${ctx.user.credits} Credits, benötigen aber ${GENERATION_COST}.`,
              });
            }

            // 3. Loggen
            balanceAfter = ctx.user.credits - GENERATION_COST;
            await tx.insert(creditsTransactions).values({
              userId,
              amount: -GENERATION_COST,
              type: 'usage',
              balanceBefore,
              balanceAfter,
              description: `Script Generation: ${input.topic}`,
              createdAt: new Date(),
            });

            creditsUsed = GENERATION_COST;
          });
        }

        // Build prompt for Gemini
        const prompt = buildGenerationPrompt(input);

        // Call Gemini API
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'You are an expert viral shorts script writer. Create engaging, short-form video scripts that are optimized for platforms like TikTok, Instagram Reels, and YouTube Shorts. Include specific equipment recommendations where relevant.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const content = response.choices[0]?.message?.content;
        const generatedScript = typeof content === 'string' ? content : '';

        if (!generatedScript) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to generate script from Gemini API',
          });
        }

        // Process affiliate links
        const { script: scriptWithLinks, linksInserted } =
          await processAffiliateLinks(generatedScript);

        // Log generation
        await logGeneration(
          userId,
          input.topic,
          scriptWithLinks,
          linksInserted,
          creditsUsed,
          'success'
        );

        return {
          script: scriptWithLinks,
          creditsUsed,
          affiliateCount: linksInserted,
          generationId: `gen_${Date.now()}`,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        // Log failed generation
        await logGeneration(
          userId,
          input.topic,
          '',
          0,
          0,
          'failed',
          errorMessage
        );

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Generation failed: ${errorMessage}`,
        });
      }
    }),
});

/**
 * Build the prompt for Gemini based on user input.
 */
function buildGenerationPrompt(input: z.infer<typeof generationInputSchema>): string {
  let prompt = `Create a viral shorts script for the following topic: "${input.topic}"\n\n`;

  if (input.targetAudience) {
    prompt += `Target audience: ${input.targetAudience}\n`;
  }

  if (input.tone) {
    prompt += `Tone: ${input.tone}\n`;
  }

  prompt += `\nRequirements:
- Length: 30-60 seconds of speaking time
- Hook: Start with an attention-grabbing opening (first 3 seconds)
- Structure: Problem → Solution → Call-to-action
- Engagement: Include specific equipment recommendations where relevant (e.g., microphones, lighting, cameras)
- Format: Write in a conversational, natural tone
- Include practical tips and actionable advice

Generate the script now:`;

  return prompt;
}
