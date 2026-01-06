import { eq, sql, and, gte } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { sendWelcomeEmail } from './services/emailService';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser, referralCode?: string): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    // Free trial: Give new users 3 free credits
    if (user.credits === undefined) {
      values.credits = 3;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    const result = await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });

    // Handle referral code for new users
    const isNewUser = result && Object.keys(updateSet).length === 1;
    if (isNewUser && referralCode) {
      try {
        // Find referrer by code
        const [referrer] = await db.select().from(users).where(eq(users.referralCode, referralCode)).limit(1);
        
        if (referrer) {
          // Get the newly created user
          const [newUser] = await db.select().from(users).where(eq(users.openId, user.openId)).limit(1);
          
          if (newUser && referrer.id !== newUser.id) {
            // Update new user with referrer
            await db.update(users)
              .set({ referredBy: referrer.id })
              .where(eq(users.id, newUser.id));

            // Create referral record
            const { referrals } = await import('../drizzle/schema');
            await db.insert(referrals).values({
              referrerId: referrer.id,
              refereeId: newUser.id,
              creditsEarned: 0,
              rewardClaimed: 0,
            });

            console.log(`[Referral] User ${newUser.id} referred by ${referrer.id} (code: ${referralCode})`);
          }
        }
      } catch (error) {
        console.error('[Referral] Failed to process referral code:', error);
        // Don't throw - referral failure shouldn't block registration
      }
    }

    // Send welcome email to new users (only if this is a new insert, not an update)
    if (isNewUser && user.email) {
      await sendWelcomeEmail(user.email, user.name || null).catch(err => {
        console.error('[Database] Failed to send welcome email:', err);
      });
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get user by email for webhook processing.
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get user by Stripe customer ID.
 */
export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Update user credits and log transaction.
 * ATOMIC: Uses single SQL UPDATE to prevent race conditions.
 * For deductions (negative amount), ensures user has sufficient credits.
 */
export async function updateUserCredits(
  userId: number,
  amount: number,
  type: 'purchase' | 'usage' | 'refund' | 'subscription_grant',
  description?: string,
  stripeCheckoutSessionId?: string
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // For deductions (usage), use atomic UPDATE with credit check
  if (amount < 0) {
    const requiredCredits = Math.abs(amount);
    
    // ATOMIC: Single SQL UPDATE that checks AND updates in one operation
    // This prevents race conditions from concurrent requests
    const result = await db.update(users)
      .set({ credits: sql`credits + ${amount}` })
      .where(and(
        eq(users.id, userId),
        gte(users.credits, requiredCredits)
      ));

    // Check if update succeeded (affectedRows === 1)
    // If affectedRows === 0, either user doesn't exist or insufficient credits
    // MySQL result is [ResultSetHeader, FieldPacket[]], access affectedRows from first element
    const affectedRows = Array.isArray(result) ? result[0]?.affectedRows : (result as any).affectedRows;
    if (!result || affectedRows === 0) {
      // Get user to determine if it's insufficient credits or user not found
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user || user.length === 0) {
        throw new Error('User not found');
      }
      throw new Error(`OUT_OF_CREDITS: User has ${user[0].credits} credits but needs ${requiredCredits}`);
    }

    // Get updated balance for logging
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const balanceAfter = user[0].credits;
    const balanceBefore = balanceAfter - amount; // Reverse calculation

    // Log transaction
    const { creditsTransactions } = await import('../drizzle/schema');
    await db.insert(creditsTransactions).values({
      userId,
      amount,
      type,
      description,
      stripeCheckoutSessionId,
      balanceBefore,
      balanceAfter,
    });

    return { balanceBefore, balanceAfter };
  }

  // For additions (purchase/refund), no credit check needed
  // Get current balance first
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) throw new Error('User not found');

  const balanceBefore = user[0].credits;
  const balanceAfter = balanceBefore + amount;

  // Update user credits
  await db.update(users).set({ credits: balanceAfter }).where(eq(users.id, userId));

  // Log transaction
  const { creditsTransactions } = await import('../drizzle/schema');
  await db.insert(creditsTransactions).values({
    userId,
    amount,
    type,
    description,
    stripeCheckoutSessionId,
    balanceBefore,
    balanceAfter,
  });

  return { balanceBefore, balanceAfter };
}

/**
 * Update user plan and create subscription record.
 */
export async function updateUserPlan(
  userId: number,
  plan: 'free' | 'pro' | 'agency',
  stripeSubscriptionId?: string
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Update user plan
  await db.update(users).set({ plan }).where(eq(users.id, userId));

  // If subscription, create subscription record
  if (stripeSubscriptionId && (plan === 'pro' || plan === 'agency')) {
    const { subscriptions } = await import('../drizzle/schema');
    const creditsPerMonth = plan === 'pro' ? 999999 : 999999; // Unlimited
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(subscriptions).values({
      userId,
      stripeSubscriptionId,
      plan,
      status: 'active',
      creditsPerMonth,
      currentPeriodStart: now,
      currentPeriodEnd: nextMonth,
    });
  }
}

/**
 * Log script generation.
 */
export async function logGeneration(
  userId: number,
  topic: string,
  generatedScript: string,
  affiliateLinksInserted: number,
  creditsUsed: number,
  status: 'success' | 'failed' | 'partial',
  errorMessage?: string
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const { generationLogs } = await import('../drizzle/schema');
  await db.insert(generationLogs).values({
    userId,
    topic,
    generatedScript,
    affiliateLinksInserted,
    creditsUsed,
    geminiTokensUsed: 0,
    status,
    errorMessage,
  });
}

/**
 * Get user credit balance and subscription info.
 */
export async function getUserCreditInfo(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) throw new Error('User not found');

  const { subscriptions, creditsTransactions } = await import('../drizzle/schema');
  const subscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  const transactions = await db.select().from(creditsTransactions).where(eq(creditsTransactions.userId, userId)).orderBy(creditsTransactions.createdAt);

  return {
    credits: user[0].credits,
    plan: user[0].plan,
    subscription: subscription.length > 0 ? subscription[0] : null,
    transactions,
  };
}
