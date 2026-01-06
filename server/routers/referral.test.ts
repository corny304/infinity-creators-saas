import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { appRouter } from '../routers';
import { getDb } from '../db';
import { users, referrals } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Referral System', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let testUser: any;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Create a test user
    await db.insert(users).values({
      openId: 'test-referrer-openid',
      name: 'Test Referrer',
      email: 'referrer@test.com',
      credits: 10,
      plan: 'free',
    });

    const [user] = await db.select().from(users).where(eq(users.openId, 'test-referrer-openid')).limit(1);
    testUser = user;
  });

  beforeEach(() => {
    // Create a test caller with test user context
    caller = appRouter.createCaller({
      user: testUser,
      req: {} as any,
      res: {} as any,
    });
  });

  describe('getMyReferralCode', () => {
    it('should generate a referral code for user without one', async () => {
      const result = await caller.referral.getMyReferralCode();

      expect(result).toHaveProperty('referralCode');
      expect(result.referralCode).toBeTruthy();
      expect(typeof result.referralCode).toBe('string');
      expect(result.referralCode.length).toBeGreaterThan(0);
    });

    it('should return existing referral code if already generated', async () => {
      const result1 = await caller.referral.getMyReferralCode();
      const result2 = await caller.referral.getMyReferralCode();

      expect(result1.referralCode).toBe(result2.referralCode);
    });

    it('should generate unique referral codes for different users', async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // Create another test user
      await db.insert(users).values({
        openId: 'test-user-2-openid',
        name: 'Test User 2',
        email: 'user2@test.com',
        credits: 5,
        plan: 'free',
      });

      const [user2] = await db.select().from(users).where(eq(users.openId, 'test-user-2-openid')).limit(1);

      const caller2 = appRouter.createCaller({
        user: user2,
        req: {} as any,
        res: {} as any,
      });

      const result1 = await caller.referral.getMyReferralCode();
      const result2 = await caller2.referral.getMyReferralCode();

      expect(result1.referralCode).not.toBe(result2.referralCode);
    });
  });

  describe('applyReferralCode', () => {
    it('should successfully apply valid referral code', async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // Get referrer's code
      const { referralCode } = await caller.referral.getMyReferralCode();

      // Create a new user (referee)
      await db.insert(users).values({
        openId: 'test-referee-openid',
        name: 'Test Referee',
        email: 'referee@test.com',
        credits: 3,
        plan: 'free',
      });

      const [referee] = await db.select().from(users).where(eq(users.openId, 'test-referee-openid')).limit(1);

      const refereeCaller = appRouter.createCaller({
        user: referee,
        req: {} as any,
        res: {} as any,
      });

      const result = await refereeCaller.referral.applyReferralCode({ referralCode });

      expect(result.success).toBe(true);
      expect(result.referrerName).toBe('Test Referrer');

      // Verify referral record was created
      const [referralRecord] = await db
        .select()
        .from(referrals)
        .where(eq(referrals.refereeId, referee.id))
        .limit(1);

      expect(referralRecord).toBeDefined();
      expect(referralRecord.referrerId).toBe(testUser.id);
      expect(referralRecord.refereeId).toBe(referee.id);
      expect(referralRecord.creditsEarned).toBe(0); // Not yet rewarded
      expect(referralRecord.rewardClaimed).toBe(0);
    });

    it('should reject invalid referral code', async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      await db.insert(users).values({
        openId: 'test-referee-2-openid',
        name: 'Test Referee 2',
        email: 'referee2@test.com',
        credits: 3,
        plan: 'free',
      });

      const [referee] = await db.select().from(users).where(eq(users.openId, 'test-referee-2-openid')).limit(1);

      const refereeCaller = appRouter.createCaller({
        user: referee,
        req: {} as any,
        res: {} as any,
      });

      await expect(
        refereeCaller.referral.applyReferralCode({ referralCode: 'INVALID123' })
      ).rejects.toThrow('Invalid referral code');
    });

    it('should prevent self-referral', async () => {
      const { referralCode } = await caller.referral.getMyReferralCode();

      await expect(
        caller.referral.applyReferralCode({ referralCode })
      ).rejects.toThrow('You cannot refer yourself');
    });

    it('should prevent applying referral code twice', async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const { referralCode } = await caller.referral.getMyReferralCode();

      // Create referee
      await db.insert(users).values({
        openId: 'test-referee-3-openid',
        name: 'Test Referee 3',
        email: 'referee3@test.com',
        credits: 3,
        plan: 'free',
      });

      const [referee] = await db.select().from(users).where(eq(users.openId, 'test-referee-3-openid')).limit(1);

      const refereeCaller = appRouter.createCaller({
        user: referee,
        req: {} as any,
        res: {} as any,
      });

      // Apply referral code first time
      await refereeCaller.referral.applyReferralCode({ referralCode });

      // Try to apply again
      await expect(
        refereeCaller.referral.applyReferralCode({ referralCode })
      ).rejects.toThrow('You have already been referred by someone');
    });
  });

  describe('getMyReferrals', () => {
    it('should return list of users referred by current user', async () => {
      const referrals = await caller.referral.getMyReferrals();

      expect(Array.isArray(referrals)).toBe(true);
      expect(referrals.length).toBeGreaterThan(0);

      referrals.forEach(referral => {
        expect(referral).toHaveProperty('id');
        expect(referral).toHaveProperty('refereeId');
        expect(referral).toHaveProperty('refereeName');
        expect(referral).toHaveProperty('refereeEmail');
        expect(referral).toHaveProperty('creditsEarned');
        expect(referral).toHaveProperty('rewardClaimed');
        expect(referral).toHaveProperty('createdAt');
      });
    });

    it('should return empty array for user with no referrals', async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      await db.insert(users).values({
        openId: 'test-no-referrals-openid',
        name: 'Test No Referrals',
        email: 'noreferrals@test.com',
        credits: 5,
        plan: 'free',
      });

      const [user] = await db.select().from(users).where(eq(users.openId, 'test-no-referrals-openid')).limit(1);

      const userCaller = appRouter.createCaller({
        user: user,
        req: {} as any,
        res: {} as any,
      });

      const referrals = await userCaller.referral.getMyReferrals();

      expect(Array.isArray(referrals)).toBe(true);
      expect(referrals.length).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return referral statistics', async () => {
      const stats = await caller.referral.getStats();

      expect(stats).toHaveProperty('totalReferrals');
      expect(stats).toHaveProperty('totalCreditsEarned');
      expect(stats).toHaveProperty('pendingRewards');

      expect(typeof stats.totalReferrals).toBe('number');
      expect(typeof stats.totalCreditsEarned).toBe('number');
      expect(typeof stats.pendingRewards).toBe('number');

      expect(stats.totalReferrals).toBeGreaterThanOrEqual(0);
      expect(stats.totalCreditsEarned).toBeGreaterThanOrEqual(0);
      expect(stats.pendingRewards).toBeGreaterThanOrEqual(0);
    });

    it('should correctly count pending rewards', async () => {
      const stats = await caller.referral.getStats();

      // All test referrals are pending (rewardClaimed = 0)
      expect(stats.pendingRewards).toBe(stats.totalReferrals);
    });
  });

  describe('Referral URL Generation', () => {
    it('should generate valid referral URL with code', async () => {
      const { referralCode } = await caller.referral.getMyReferralCode();

      const baseUrl = 'https://infinitycreators.com';
      const referralUrl = `${baseUrl}/?ref=${referralCode}`;

      expect(referralUrl).toContain('ref=');
      expect(referralUrl).toContain(referralCode);

      // Verify URL is valid
      const url = new URL(referralUrl);
      expect(url.searchParams.get('ref')).toBe(referralCode);
    });
  });
});
