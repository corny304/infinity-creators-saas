import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getUserByEmail, updateUserCredits, updateUserPlan } from '../db';
import { sendPaymentConfirmationEmail, sendSubscriptionConfirmationEmail } from '../services/emailService';

// Initialize Stripe - use custom secret key if available, fallback to built-in
const stripeSecretKey = process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
});

/**
 * Verify Stripe webhook signature
 * Returns the event if valid, throws if invalid
 */
function verifyWebhookSignature(req: Request): Stripe.Event {
  const signature = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_LIVE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    throw new Error('Missing signature or webhook secret');
  }

  try {
    // Verify webhook signature using Stripe SDK
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );
    return event;
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err);
    throw new Error('Invalid signature');
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  try {
    const event = verifyWebhookSignature(req);

    console.log('[Stripe Webhook] Received event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;

      default:
        console.log('[Stripe Webhook] Unhandled event type:', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
}

/**
 * Handle checkout.session.completed event
 * This fires when user completes payment
 */
async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = session.metadata as Record<string, unknown> | undefined;
  const customerEmail = session.customer_email as string | undefined;

  if (!customerEmail) {
    throw new Error('No customer email in checkout session');
  }

  // Find user by email
  const user = await getUserByEmail(customerEmail);
  if (!user) {
    console.warn(`[Stripe Webhook] User not found for email: ${customerEmail}`);
    return;
  }

  // Determine if this is a subscription or one-time purchase
  const subscriptionId = session.subscription as string | undefined;
  const lineItems = session.line_items as Record<string, unknown> | undefined;

  if (subscriptionId) {
    // Subscription purchase
    const planType = metadata?.planType as string | undefined || 'pro';
    await updateUserPlan(user.id, planType as 'pro' | 'agency', subscriptionId);
    console.log(`[Stripe Webhook] Updated user ${user.id} to plan: ${planType}`);

    // Send subscription confirmation email
    if (user.email) {
      const creditsPerMonth = planType === 'pro' ? 100 : 500;
      await sendSubscriptionConfirmationEmail(
        user.email,
        user.name,
        planType as 'pro' | 'agency',
        creditsPerMonth
      ).catch(err => {
        console.error('[Webhook] Failed to send subscription confirmation email:', err);
      });
    }
  } else if (lineItems) {
    // One-time credit purchase
    const credits = metadata?.credits as unknown;
    const creditsAmount = typeof credits === 'string' ? parseInt(credits, 10) : 0;

    if (creditsAmount > 0) {
      await updateUserCredits(
        user.id,
        creditsAmount,
        'purchase',
        `Purchased ${creditsAmount} credits`,
        session.id as string
      );
      console.log(`[Stripe Webhook] Added ${creditsAmount} credits to user ${user.id}`);

      // Handle referral reward (if this is the first purchase)
      await handleReferralReward(user.id);

      // Send payment confirmation email
      if (user.email) {
        await sendPaymentConfirmationEmail(
          user.email,
          user.name,
          creditsAmount,
          session.amount_total as number || 0
        ).catch(err => {
          console.error('[Webhook] Failed to send payment confirmation email:', err);
        });
      }
    }
  }
}

/**
 * Handle referral reward when user makes first purchase
 */
async function handleReferralReward(userId: number) {
  try {
    const { getDb } = await import('../db');
    const { users, referrals } = await import('../../drizzle/schema');
    const { eq, and, sql } = await import('drizzle-orm');
    
    const db = await getDb();
    if (!db) return;

    // Check if user was referred by someone
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!user || !user.referredBy) {
      return; // User wasn't referred
    }

    // Check if referral reward was already claimed
    const [referral] = await db
      .select()
      .from(referrals)
      .where(and(
        eq(referrals.refereeId, userId),
        eq(referrals.referrerId, user.referredBy)
      ))
      .limit(1);

    if (!referral || referral.rewardClaimed === 1) {
      return; // Reward already claimed
    }

    // Award 5 credits to referrer
    const REFERRAL_REWARD = 5;
    await db
      .update(users)
      .set({ credits: sql`credits + ${REFERRAL_REWARD}` })
      .where(eq(users.id, user.referredBy));

    // Mark referral as rewarded
    await db
      .update(referrals)
      .set({
        creditsEarned: REFERRAL_REWARD,
        rewardClaimed: 1,
        rewardedAt: new Date(),
      })
      .where(eq(referrals.id, referral.id));

    console.log(`[Referral] Awarded ${REFERRAL_REWARD} credits to user ${user.referredBy} for referring user ${userId}`);

    // TODO: Send email notification to referrer
  } catch (error) {
    console.error('[Referral] Failed to process referral reward:', error);
    // Don't throw - referral failure shouldn't block payment processing
  }
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string | undefined;

  if (!customerId) {
    throw new Error('No customer ID in subscription event');
  }

  // In production, look up user by Stripe customer ID
  console.log(`[Stripe Webhook] Subscription updated for customer: ${customerId}`);
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string | undefined;

  if (!customerId) {
    throw new Error('No customer ID in subscription event');
  }

  // In production, update user plan to 'free'
  console.log(`[Stripe Webhook] Subscription deleted for customer: ${customerId}`);
}
