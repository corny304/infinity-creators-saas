import { describe, it, expect } from 'vitest';
import Stripe from 'stripe';

/**
 * Test Stripe integration with live API keys
 * Verifies that:
 * 1. Stripe SDK can be initialized
 * 2. All Price IDs are valid and exist in Stripe
 * 3. Webhook secret is properly configured
 */
describe('Stripe Integration', () => {
  const stripeSecretKey = process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY || '';
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-12-15.clover',
  });

  it('should initialize Stripe SDK successfully', () => {
    expect(stripe).toBeDefined();
    const secretKey = process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    expect(secretKey).toBeDefined();
    expect(secretKey).toMatch(/^sk_(live|test)_/);
  });

  it('should have valid webhook secret', () => {
    const webhookSecret = process.env.STRIPE_LIVE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;
    expect(webhookSecret).toBeDefined();
    expect(webhookSecret).toMatch(/^whsec_/);
  });

  it('should have all required Price IDs configured', () => {
    expect(process.env.STRIPE_PRICE_CREDITS_10).toBeDefined();
    expect(process.env.STRIPE_PRICE_CREDITS_50).toBeDefined();
    expect(process.env.STRIPE_PRICE_CREDITS_100).toBeDefined();
    expect(process.env.STRIPE_PRICE_PRO).toBeDefined();
    expect(process.env.STRIPE_PRICE_AGENCY).toBeDefined();

    // All Price IDs should start with 'price_'
    expect(process.env.STRIPE_PRICE_CREDITS_10).toMatch(/^price_/);
    expect(process.env.STRIPE_PRICE_CREDITS_50).toMatch(/^price_/);
    expect(process.env.STRIPE_PRICE_CREDITS_100).toMatch(/^price_/);
    expect(process.env.STRIPE_PRICE_PRO).toMatch(/^price_/);
    expect(process.env.STRIPE_PRICE_AGENCY).toMatch(/^price_/);
  });

  it('should retrieve 10 Credits price from Stripe API', async () => {
    const priceId = process.env.STRIPE_PRICE_CREDITS_10!;
    const price = await stripe.prices.retrieve(priceId);

    expect(price).toBeDefined();
    expect(price.id).toBe(priceId);
    expect(price.active).toBe(true);
    expect(price.unit_amount).toBe(999); // $9.99 in cents
  });

  it('should retrieve 50 Credits price from Stripe API', async () => {
    const priceId = process.env.STRIPE_PRICE_CREDITS_50!;
    const price = await stripe.prices.retrieve(priceId);

    expect(price).toBeDefined();
    expect(price.id).toBe(priceId);
    expect(price.active).toBe(true);
    expect(price.unit_amount).toBe(3999); // $39.99 in cents
  });

  it('should retrieve 100 Credits price from Stripe API', async () => {
    const priceId = process.env.STRIPE_PRICE_CREDITS_100!;
    const price = await stripe.prices.retrieve(priceId);

    expect(price).toBeDefined();
    expect(price.id).toBe(priceId);
    expect(price.active).toBe(true);
    expect(price.unit_amount).toBe(6999); // $69.99 in cents
  });

  it('should retrieve Pro subscription price from Stripe API', async () => {
    const priceId = process.env.STRIPE_PRICE_PRO!;
    const price = await stripe.prices.retrieve(priceId);

    expect(price).toBeDefined();
    expect(price.id).toBe(priceId);
    expect(price.active).toBe(true);
    expect(price.type).toBe('recurring');
    expect(price.recurring?.interval).toBe('month');
  });

  it('should retrieve Agency subscription price from Stripe API', async () => {
    const priceId = process.env.STRIPE_PRICE_AGENCY!;
    const price = await stripe.prices.retrieve(priceId);

    expect(price).toBeDefined();
    expect(price.id).toBe(priceId);
    expect(price.active).toBe(true);
    expect(price.type).toBe('recurring');
    expect(price.recurring?.interval).toBe('month');
  });
});
