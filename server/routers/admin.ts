import { TRPCError } from '@trpc/server';
import { eq, sql, desc } from 'drizzle-orm';
import { creditsTransactions, generationLogs, subscriptions, users } from '../../drizzle/schema';
import { getDb } from '../db';
import { protectedProcedure, router } from '../_core/trpc';

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }
  return next({ ctx });
});

export const adminRouter = router({
  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database not available',
      });
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total users
    const totalUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const totalUsers = Number(totalUsersResult[0]?.count || 0);

    // New users this month
    const newUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.createdAt} >= ${firstDayOfMonth}`);
    const newUsersThisMonth = Number(newUsersResult[0]?.count || 0);

    // Total revenue
    const totalRevenueResult = await db
      .select({ sum: sql<number>`sum(${creditsTransactions.amount})` })
      .from(creditsTransactions)
      .where(eq(creditsTransactions.type, 'purchase'));
    const totalRevenue = Number(totalRevenueResult[0]?.sum || 0);

    // Revenue this month
    const revenueThisMonthResult = await db
      .select({ sum: sql<number>`sum(${creditsTransactions.amount})` })
      .from(creditsTransactions)
      .where(sql`${creditsTransactions.type} = 'purchase' AND ${creditsTransactions.createdAt} >= ${firstDayOfMonth}`);
    const revenueThisMonth = Number(revenueThisMonthResult[0]?.sum || 0);

    // Total generations
    const totalGenerationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(generationLogs);
    const totalGenerations = Number(totalGenerationsResult[0]?.count || 0);

    // Generations this month
    const generationsThisMonthResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(generationLogs)
      .where(sql`${generationLogs.createdAt} >= ${firstDayOfMonth}`);
    const generationsThisMonth = Number(generationsThisMonthResult[0]?.count || 0);

    // Active subscriptions
    const activeSubscriptionsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'));
    const activeSubscriptions = Number(activeSubscriptionsResult[0]?.count || 0);

    // Monthly recurring revenue (MRR) - calculate based on plan types
    const proCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.plan, 'pro'));
    const agencyCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.plan, 'agency'));
    
    const monthlyRecurringRevenue = 
      (Number(proCount[0]?.count || 0) * 2900) + 
      (Number(agencyCount[0]?.count || 0) * 9900);

    return {
      totalUsers,
      newUsersThisMonth,
      totalRevenue,
      revenueThisMonth,
      totalGenerations,
      generationsThisMonth,
      activeSubscriptions,
      monthlyRecurringRevenue,
    };
  }),

  getRecentTransactions: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database not available',
      });
    }

    const transactions = await db
      .select({
        id: creditsTransactions.id,
        userId: creditsTransactions.userId,
        userEmail: users.email,
        type: creditsTransactions.type,
        amount: creditsTransactions.amount,
        credits: creditsTransactions.amount,
        createdAt: creditsTransactions.createdAt,
      })
      .from(creditsTransactions)
      .leftJoin(users, eq(creditsTransactions.userId, users.id))
      .orderBy(desc(creditsTransactions.createdAt))
      .limit(10);

    return transactions;
  }),

  getTopUsers: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database not available',
      });
    }

    const topUsers = await db
      .select({
        id: users.id,
        email: users.email,
        plan: users.plan,
        credits: users.credits,
        createdAt: users.createdAt,
        totalGenerations: sql<number>`count(${generationLogs.id})`,
      })
      .from(users)
      .leftJoin(generationLogs, eq(users.id, generationLogs.userId))
      .groupBy(users.id)
      .orderBy(desc(sql`count(${generationLogs.id})`))
      .limit(10);

    return topUsers;
  }),
});
