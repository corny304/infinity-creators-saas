import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `user${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("referral system", () => {
  it("generates referral code for user", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.referral.getMyReferralCode();

    expect(result).toHaveProperty("referralCode");
    expect(typeof result.referralCode).toBe("string");
    expect(result.referralCode.length).toBeGreaterThan(0);
  });

  it("returns referral statistics", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.referral.getStats();

    expect(stats).toHaveProperty("totalReferrals");
    expect(stats).toHaveProperty("totalCreditsEarned");
    expect(stats).toHaveProperty("pendingRewards");
    expect(typeof stats.totalReferrals).toBe("number");
    expect(typeof stats.totalCreditsEarned).toBe("number");
    expect(typeof stats.pendingRewards).toBe("number");
  });

  it("returns list of referrals", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const referrals = await caller.referral.getMyReferrals();

    expect(Array.isArray(referrals)).toBe(true);
  });
});

describe("script templates", () => {
  it("returns list of active templates", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const templates = await caller.templates.list();

    expect(Array.isArray(templates)).toBe(true);
    expect(templates.length).toBeGreaterThan(0);
    
    if (templates.length > 0) {
      const template = templates[0];
      expect(template).toHaveProperty("id");
      expect(template).toHaveProperty("name");
      expect(template).toHaveProperty("description");
      expect(template).toHaveProperty("category");
      expect(template).toHaveProperty("icon");
      expect(template).toHaveProperty("topicPlaceholder");
      expect(template).toHaveProperty("exampleTopic");
    }
  });

  it("templates have correct structure", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const templates = await caller.templates.list();

    templates.forEach((template) => {
      expect(typeof template.name).toBe("string");
      expect(typeof template.description).toBe("string");
      expect(typeof template.category).toBe("string");
      expect(typeof template.icon).toBe("string");
      expect(["professional", "casual", "humorous"]).toContain(template.defaultTone);
    });
  });
});
