import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import Stripe from 'stripe';
import { protectedProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { subscriptions } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

// Initialize Stripe - use custom secret key if available, fallback to built-in
const stripeSecretKey = process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
});

const SUBSCRIPTION_PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    price: 1900, // $19/month in cents
    creditsPerMonth: 999999,
    stripePriceId: process.env.STRIPE_PRICE_PRO || 'price_test_pro',
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 3999, // $39.99/month in cents
    creditsPerMonth: 999999,
    stripePriceId: process.env.STRIPE_PRICE_AGENCY || 'price_test_agency',
  },
];

export const subscriptionRouter = router({
  /**
   * Get available subscription plans
   */
  getPlans: protectedProcedure.query(() => {
    return SUBSCRIPTION_PLANS.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      creditsPerMonth: plan.creditsPerMonth,
      stripePriceId: plan.stripePriceId,
    }));
  }),

  /**
   * Create Stripe Checkout session for subscription
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        planId: z.enum(['pro', 'agency']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const plan = SUBSCRIPTION_PLANS.find((p) => p.id === input.planId);
        if (!plan) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid plan ID',
          });
        }

        // Create Stripe Checkout Session for subscription
        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price: plan.stripePriceId,
              quantity: 1,
            },
          ],
          customer_email: ctx.user.email || undefined,
          metadata: {
            userId: ctx.user.id.toString(),
            planType: plan.id,
          },
          success_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/dashboard?subscription=success`,
          cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/pricing?subscription=cancelled`,
        });

        const checkoutUrl = session.url!;

        return {
          checkoutUrl,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create checkout session',
        });
      }
    }),

  /**
   * Cancel active subscription
   */
  cancel: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database not available',
        });
      }

      // Find active subscription
      const activeSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1);

      if (!activeSubscription || activeSubscription.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No active subscription found',
        });
      }

      const sub = activeSubscription[0];

      // Update subscription status to cancelled
      await db
        .update(subscriptions)
        .set({
          status: 'cancelled',
          cancelledAt: new Date(),
        })
        .where(eq(subscriptions.id, sub.id));

      return {
        success: true,
        nextBillingDate: sub.currentPeriodEnd.toISOString(),
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to cancel subscription',
      });
    }
  }),
});
