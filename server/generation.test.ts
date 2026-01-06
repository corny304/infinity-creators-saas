import { describe, expect, it, beforeEach, vi } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';
import type { User } from '../drizzle/schema';

// Mock the invokeLLM function
vi.mock('./_core/llm', () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: 'Test script with camera and microphone equipment mentioned.'
      }
    }]
  })
}));

// Mock the database functions
vi.mock('./db', () => ({
  getUserByOpenId: vi.fn().mockResolvedValue({
    id: 1,
    openId: 'test-user',
    email: 'test@example.com',
    name: 'Test User',
    credits: 10,
    plan: 'free',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  }),
  deductCredits: vi.fn().mockResolvedValue(undefined),
  logGeneration: vi.fn().mockResolvedValue(undefined),
  updateUserCredits: vi.fn().mockResolvedValue(undefined),
  getDb: vi.fn().mockResolvedValue(null),
}));

// Mock the affiliate service
vi.mock('./services/affiliateService', () => ({
  insertAffiliateLinks: vi.fn().mockReturnValue({
    script: 'Test script with affiliate links',
    affiliateCount: 2,
  }),
  processAffiliateLinks: vi.fn().mockResolvedValue({
    script: 'Test script with affiliate links',
    affiliateCount: 2,
  }),
}));

function createTestContext(): { ctx: TrpcContext } {
  const user: User = {
    id: 1,
    openId: 'test-user',
    email: 'test@example.com',
    name: 'Test User',
    loginMethod: 'manus',
    role: 'user',
    credits: 10,
    plan: 'free',
    stripeCustomerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  };

  return { ctx };
}

describe('generation.create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate a script successfully with sufficient credits', async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.generation.create({
      topic: 'How to start a YouTube channel',
      targetAudience: 'Beginners',
      tone: 'casual',
    });

    expect(result).toHaveProperty('script');
    expect(result).toHaveProperty('creditsUsed');
    expect(result).toHaveProperty('generationId');
    expect(result.script).toBeTruthy();
    expect(typeof result.script).toBe('string');
    expect(result.creditsUsed).toBeGreaterThan(0);
  });

  it('should throw error when user has insufficient credits', async () => {
    const { ctx } = createTestContext();
    // Override the user to have 0 credits
    ctx.user!.credits = 0;
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.generation.create({
        topic: 'Test topic',
        tone: 'casual',
      })
    ).rejects.toThrow('Insufficient credits');
  });

  it('should require authentication', async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: 'https',
        headers: {},
      } as TrpcContext['req'],
      res: {} as TrpcContext['res'],
    };
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.generation.create({
        topic: 'Test topic',
        tone: 'casual',
      })
    ).rejects.toThrow('Please login');
  });

  it('should validate input parameters', async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Test empty topic
    await expect(
      caller.generation.create({
        topic: '',
        tone: 'casual',
      })
    ).rejects.toThrow();

    // Test invalid tone
    await expect(
      caller.generation.create({
        topic: 'Valid topic',
        tone: 'invalid' as any,
      })
    ).rejects.toThrow();
  });

  it('should handle different tones correctly', async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const tones: Array<'funny' | 'professional' | 'casual' | 'motivational'> = [
      'funny',
      'professional',
      'casual',
      'motivational',
    ];

    for (const tone of tones) {
      const result = await caller.generation.create({
        topic: 'Test topic',
        tone,
      });

      expect(result).toHaveProperty('script');
      expect(result.script).toBeTruthy();
    }
  });

  it('should include target audience in generation when provided', async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.generation.create({
      topic: 'Fitness tips',
      targetAudience: 'Gym beginners',
      tone: 'motivational',
    });

    expect(result).toHaveProperty('script');
    expect(result.script).toBeTruthy();
  });
});
