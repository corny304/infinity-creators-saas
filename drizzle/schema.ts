import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, longtext, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** Stripe customer ID for payment processing */
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  /** Unique referral code for this user (e.g., "JOHN123") */
  referralCode: varchar("referralCode", { length: 20 }).unique(),
  /** ID of the user who referred this user (nullable) */
  referredBy: int("referredBy"),
  /** Current subscription plan */
  plan: mysqlEnum("plan", ["free", "pro", "agency"]).default("free").notNull(),
  /** Available credits for content generation */
  credits: int("credits").default(3).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscriptions table tracks active and historical subscriptions.
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).notNull().unique(),
  plan: mysqlEnum("plan", ["pro", "agency"]).notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "paused"]).default("active").notNull(),
  creditsPerMonth: int("creditsPerMonth").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Credits transactions audit log.
 */
export const creditsTransactions = mysqlTable("creditsTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(),
  type: mysqlEnum("type", ["purchase", "usage", "refund", "subscription_grant"]).notNull(),
  stripeCheckoutSessionId: varchar("stripeCheckoutSessionId", { length: 255 }),
  description: text("description"),
  balanceBefore: int("balanceBefore").notNull(),
  balanceAfter: int("balanceAfter").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditsTransaction = typeof creditsTransactions.$inferSelect;
export type InsertCreditsTransaction = typeof creditsTransactions.$inferInsert;

/**
 * Generation logs for analytics and debugging.
 */
export const generationLogs = mysqlTable("generationLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  generatedScript: longtext("generatedScript").notNull(),
  affiliateLinksInserted: int("affiliateLinksInserted").default(0).notNull(),
  creditsUsed: int("creditsUsed").notNull(),
  geminiTokensUsed: int("geminiTokensUsed").default(0).notNull(),
  status: mysqlEnum("status", ["success", "failed", "partial"]).notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GenerationLog = typeof generationLogs.$inferSelect;
export type InsertGenerationLog = typeof generationLogs.$inferInsert;

/**
 * Affiliate links master list.
 */
export const affiliateLinks = mysqlTable("affiliateLinks", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  amazonAsin: varchar("amazonAsin", { length: 20 }).notNull(),
  affiliateTag: varchar("affiliateTag", { length: 255 }).notNull(),
  affiliateUrl: varchar("affiliateUrl", { length: 512 }).notNull(),
  keywords: text("keywords"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type InsertAffiliateLink = typeof affiliateLinks.$inferInsert;

/**
 * Referrals table - tracks referral relationships and rewards
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  /** User who made the referral */
  referrerId: int("referrerId").notNull(),
  /** User who was referred */
  refereeId: int("refereeId").notNull(),
  /** Credits earned by referrer (typically 5) */
  creditsEarned: int("creditsEarned").default(0).notNull(),
  /** Whether the referee has made their first purchase */
  rewardClaimed: int("rewardClaimed").default(0).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  rewardedAt: timestamp("rewardedAt"),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Script templates - pre-defined templates for common use cases
 */
export const scriptTemplates = mysqlTable("script_templates", {
  id: int("id").autoincrement().primaryKey(),
  /** Template name (e.g., "Product Review") */
  name: varchar("name", { length: 100 }).notNull(),
  /** Template description */
  description: text("description").notNull(),
  /** Template category (e.g., "Review", "Tutorial", "Storytime") */
  category: varchar("category", { length: 50 }).notNull(),
  /** Default tone for this template */
  defaultTone: mysqlEnum("defaultTone", ["professional", "casual", "humorous"]).default("casual").notNull(),
  /** Placeholder text for topic input */
  topicPlaceholder: text("topicPlaceholder").notNull(),
  /** Example topic for this template */
  exampleTopic: text("exampleTopic").notNull(),
  /** Icon emoji for UI */
  icon: varchar("icon", { length: 10 }).default("📝").notNull(),
  /** Display order */
  sortOrder: int("sortOrder").default(0).notNull(),
  /** Whether template is active */
  isActive: int("isActive").default(1).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ScriptTemplate = typeof scriptTemplates.$inferSelect;
export type InsertScriptTemplate = typeof scriptTemplates.$inferInsert;
