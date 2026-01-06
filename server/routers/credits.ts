import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import Stripe from 'stripe';
import { protectedProcedure, publicProcedure, router } from '../_core/trpc';
import { getUserCreditInfo } from '../db';

// Initialize Stripe - use custom secret key if available, fallback to built-in
const stripeSecretKey = process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
});

/**
 * Credit packages available for purchase
 */
const CREDIT_PACKAGES = [
  {
    id: 'credits_10',
    name: '10 Credits',
    credits: 10,
    price: 499, // $4.99 in cents
    stripePriceId: process.env.STRIPE_PRICE_CREDITS_10 || 'price_test_10',
  },
  {
    id: 'credits_50',
    name: '50 Credits',
    credits: 50,
    price: 1999, // $19.99 in cents
    stripePriceId: process.env.STRIPE_PRICE_CREDITS_50 || 'price_test_50',
  },
  {
    id: 'credits_100',
    name: '100 Credits',
    credits: 100,
    price: 2999, // $29.99 in cents
    stripePriceId: process.env.STRIPE_PRICE_CREDITS_100 || 'price_test_100',
  },
];

/**
 * Subscription plans available
 */
const SUBSCRIPTION_PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    price: 1900, // $19/month in cents
    creditsPerMonth: 999999, // Unlimited
    stripePriceId: process.env.STRIPE_PRICE_PRO || 'price_test_pro',
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 3999, // $39.99/month in cents
    creditsPerMonth: 999999, // Unlimited
    stripePriceId: process.env.STRIPE_PRICE_AGENCY || 'price_test_agency',
  },
];

export const creditsRouter = router({
  /**
   * Get available credit packages
   */
  getPurchaseOptions: publicProcedure.query(() => {
    return CREDIT_PACKAGES.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      credits: pkg.credits,
      price: pkg.price,
      stripePriceId: pkg.stripePriceId,
    }));
  }),

  /**
   * Get available subscription plans
   */
  getSubscriptionPlans: publicProcedure.query(() => {
    return SUBSCRIPTION_PLANS.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      creditsPerMonth: plan.creditsPerMonth,
      stripePriceId: plan.stripePriceId,
    }));
  }),

  /**
   * Get current user credit balance and subscription info
   */
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    try {
      const creditInfo = await getUserCreditInfo(ctx.user.id);

      return {
        credits: creditInfo.credits,
        plan: creditInfo.plan,
        subscription: creditInfo.subscription
          ? {
              id: creditInfo.subscription.id,
              plan: creditInfo.subscription.plan,
              status: creditInfo.subscription.status,
              renewsAt: creditInfo.subscription.currentPeriodEnd.toISOString(),
            }
          : null,
        transactions: creditInfo.transactions.map((t) => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          description: t.description,
          createdAt: t.createdAt.toISOString(),
        })),
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch credit balance',
      });
    }
  }),

  /**
   * Create Stripe Checkout session for credit purchase
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
        quantity: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Find the package
        const pkg = CREDIT_PACKAGES.find((p) => p.stripePriceId === input.priceId);
        if (!pkg) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid price ID',
          });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          line_items: [
            {
              price: input.priceId,
              quantity: input.quantity || 1,
            },
          ],
          customer_email: ctx.user.email || undefined,
          metadata: {
            userId: ctx.user.id.toString(),
            credits: pkg.credits.toString(),
          },
          success_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/dashboard?payment=success`,
          cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/pricing?payment=cancelled`,
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
});
