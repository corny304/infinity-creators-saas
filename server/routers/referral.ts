import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { referrals, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Referral router - handles referral code generation, tracking, and rewards
 */
export const referralRouter = router({
  /**
   * Get current user's referral code (generate if doesn't exist)
   */
  getMyReferralCode: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const user = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    
    if (!user[0]) throw new Error("User not found");

    // Generate referral code if doesn't exist
    if (!user[0].referralCode) {
      const referralCode = `${user[0].name?.toUpperCase().replace(/[^A-Z]/g, "").substring(0, 4) || "USER"}${nanoid(6)}`;
      
      await db.update(users)
        .set({ referralCode })
        .where(eq(users.id, ctx.user.id));

      return { referralCode };
    }

    return { referralCode: user[0].referralCode };
  }),

  /**
   * Get list of users referred by current user
   */
  getMyReferrals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const myReferrals = await db
      .select({
        id: referrals.id,
        refereeId: referrals.refereeId,
        refereeName: users.name,
        refereeEmail: users.email,
        creditsEarned: referrals.creditsEarned,
        rewardClaimed: referrals.rewardClaimed,
        createdAt: referrals.createdAt,
        rewardedAt: referrals.rewardedAt,
      })
      .from(referrals)
      .leftJoin(users, eq(referrals.refereeId, users.id))
      .where(eq(referrals.referrerId, ctx.user.id));

    return myReferrals;
  }),

  /**
   * Apply referral code during registration (called from frontend)
   */
  applyReferralCode: protectedProcedure
    .input(z.object({ referralCode: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if user already has a referrer
      const currentUser = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
      
      if (currentUser[0]?.referredBy) {
        throw new Error("You have already been referred by someone");
      }

      // Find referrer by code
      const referrer = await db.select().from(users).where(eq(users.referralCode, input.referralCode)).limit(1);
      
      if (!referrer[0]) {
        throw new Error("Invalid referral code");
      }

      if (referrer[0].id === ctx.user.id) {
        throw new Error("You cannot refer yourself");
      }

      // Update user with referrer
      await db.update(users)
        .set({ referredBy: referrer[0].id })
        .where(eq(users.id, ctx.user.id));

      // Create referral record
      await db.insert(referrals).values({
        referrerId: referrer[0].id,
        refereeId: ctx.user.id,
        creditsEarned: 0,
        rewardClaimed: 0,
      });

      return { success: true, referrerName: referrer[0].name };
    }),

  /**
   * Get referral statistics
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const myReferrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, ctx.user.id));

    const totalReferrals = myReferrals.length;
    const totalCreditsEarned = myReferrals.reduce((sum, r) => sum + r.creditsEarned, 0);
    const pendingRewards = myReferrals.filter(r => r.rewardClaimed === 0).length;

    return {
      totalReferrals,
      totalCreditsEarned,
      pendingRewards,
    };
  }),
});
