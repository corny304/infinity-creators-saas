import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  findAffiliateMatches,
  insertAffiliateLinks,
  processAffiliateLinks,
  invalidateAffiliateCache,
} from './affiliateService';

// Mock the database module
vi.mock('../db', () => ({
  getDb: vi.fn(),
}));

// Mock affiliate links data
const mockAffiliateLinks = [
  {
    id: 1,
    category: 'tech',
    productName: 'iPhone 15 Pro',
    amazonAsin: 'B0CHX1W1XY',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amzn.to/iphone15pro',
    keywords: 'iphone,iphone 15,iphone 15 pro',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    category: 'tech',
    productName: 'AirPods Pro',
    amazonAsin: 'B0CHWRXH8B',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amzn.to/airpodspro',
    keywords: 'airpods,airpods pro,wireless earbuds',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 3,
    category: 'camera',
    productName: 'Sony A7 IV',
    amazonAsin: 'B09JZT6YK5',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amzn.to/sonya7iv',
    keywords: 'sony a7,sony a7 iv,mirrorless camera',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 4,
    category: 'inactive',
    productName: 'Old Product',
    amazonAsin: 'B0000000',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amzn.to/old',
    keywords: 'old product',
    isActive: false, // Inactive product
    createdAt: new Date(),
  },
];

describe('Affiliate Service', () => {
  beforeEach(async () => {
    // Reset cache before each test
    invalidateAffiliateCache();

    // Mock getDb to return mock data
    const { getDb } = await import('../db');
    vi.mocked(getDb).mockResolvedValue({
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(
            mockAffiliateLinks.filter((link) => link.isActive)
          ),
        }),
      }),
    } as any);
  });

  describe('findAffiliateMatches', () => {
    it('should find single product mention in script', async () => {
      const script = 'Check out this amazing iPhone 15 Pro review!';
      const matches = await findAffiliateMatches(script);

      expect(matches).toHaveLength(1);
      expect(matches[0].productName).toBe('iPhone 15 Pro');
      expect(matches[0].affiliateUrl).toBe('https://amzn.to/iphone15pro');
      expect(matches[0].category).toBe('tech');
    });

    it('should find multiple products in script', async () => {
      const script =
        'The iPhone 15 Pro works great with AirPods Pro for wireless audio!';
      const matches = await findAffiliateMatches(script);

      expect(matches).toHaveLength(2);
      expect(matches[0].productName).toBe('iPhone 15 Pro');
      expect(matches[1].productName).toBe('AirPods Pro');
    });

    it('should be case-insensitive', async () => {
      const script = 'I love my IPHONE 15 PRO and airpods pro!';
      const matches = await findAffiliateMatches(script);

      expect(matches).toHaveLength(2);
    });

    it('should match alternative keywords', async () => {
      const script = 'These wireless earbuds are amazing!';
      const matches = await findAffiliateMatches(script);

      expect(matches).toHaveLength(1);
      expect(matches[0].productName).toBe('AirPods Pro');
    });

    it('should return empty array for script without products', async () => {
      const script = 'This is a generic video about productivity tips.';
      const matches = await findAffiliateMatches(script);

      expect(matches).toHaveLength(0);
    });

    it('should not match inactive products', async () => {
      const script = 'Check out this old product!';
      const matches = await findAffiliateMatches(script);

      expect(matches).toHaveLength(0);
    });

    it('should only match each product once', async () => {
      const script =
        'iPhone 15 Pro is great. iPhone 15 Pro is amazing. iPhone 15 Pro is the best!';
      const matches = await findAffiliateMatches(script);

      expect(matches).toHaveLength(1);
    });
  });

  describe('insertAffiliateLinks', () => {
    it('should insert affiliate link for matched product', () => {
      const script = 'Check out the iPhone 15 Pro!';
      const matches = [
        {
          productName: 'iPhone 15 Pro',
          affiliateUrl: 'https://amzn.to/iphone15pro',
          category: 'tech',
          keywords: ['iphone', 'iphone 15', 'iphone 15 pro'],
        },
      ];

      const { updatedScript, insertedCount } = insertAffiliateLinks(
        script,
        matches
      );

      expect(updatedScript).toContain('[iPhone 15 Pro](https://amzn.to/iphone15pro)');
      expect(insertedCount).toBe(1);
    });

    it('should insert multiple affiliate links', () => {
      const script = 'The iPhone works great with AirPods!';
      const matches = [
        {
          productName: 'iPhone 15 Pro',
          affiliateUrl: 'https://amzn.to/iphone15pro',
          category: 'tech',
          keywords: ['iphone'],
        },
        {
          productName: 'AirPods Pro',
          affiliateUrl: 'https://amzn.to/airpodspro',
          category: 'tech',
          keywords: ['airpods'],
        },
      ];

      const { updatedScript, insertedCount } = insertAffiliateLinks(
        script,
        matches
      );

      expect(updatedScript).toContain('[iPhone 15 Pro](https://amzn.to/iphone15pro)');
      expect(updatedScript).toContain('[AirPods Pro](https://amzn.to/airpodspro)');
      expect(insertedCount).toBe(2);
    });

    it('should not double-link already linked text', () => {
      const script = 'Check out [iPhone 15 Pro](https://example.com)!';
      const matches = [
        {
          productName: 'iPhone 15 Pro',
          affiliateUrl: 'https://amzn.to/iphone15pro',
          category: 'tech',
          keywords: ['iphone'],
        },
      ];

      const { updatedScript, insertedCount } = insertAffiliateLinks(
        script,
        matches
      );

      // Should not modify existing link
      expect(updatedScript).toBe(script);
      expect(insertedCount).toBe(0);
    });

    it('should handle empty matches array', () => {
      const script = 'This is a test script.';
      const matches: any[] = [];

      const { updatedScript, insertedCount } = insertAffiliateLinks(
        script,
        matches
      );

      expect(updatedScript).toBe(script);
      expect(insertedCount).toBe(0);
    });

    it('should preserve script formatting', () => {
      const script = `🔥 STOP SCROLLING! 

I tested the iPhone 15 Pro for 30 days.

Here's what you need to know...`;

      const matches = [
        {
          productName: 'iPhone 15 Pro',
          affiliateUrl: 'https://amzn.to/iphone15pro',
          category: 'tech',
          keywords: ['iphone 15 pro'],
        },
      ];

      const { updatedScript, insertedCount } = insertAffiliateLinks(
        script,
        matches
      );

      expect(updatedScript).toContain('🔥 STOP SCROLLING!');
      expect(updatedScript).toContain('[iPhone 15 Pro](https://amzn.to/iphone15pro)');
      expect(insertedCount).toBe(1);
    });
  });

  describe('processAffiliateLinks', () => {
    it('should process script end-to-end', async () => {
      const script = `🔥 STOP SCROLLING! 

I tested the iPhone 15 Pro and AirPods Pro for 30 days.

The camera quality is insane! 📸

Link in bio 👆`;

      const result = await processAffiliateLinks(script);

      expect(result.script).toContain('[iPhone 15 Pro](https://amzn.to/iphone15pro)');
      expect(result.script).toContain('[AirPods Pro](https://amzn.to/airpodspro)');
      expect(result.linksInserted).toBe(2);
    });

    it('should handle script without products', async () => {
      const script = 'This is a generic productivity tip video.';

      const result = await processAffiliateLinks(script);

      expect(result.script).toBe(script);
      expect(result.linksInserted).toBe(0);
    });

    it('should handle real-world tech review script', async () => {
      const script = `🔥 I tried the Sony A7 IV for 30 days...

This mirrorless camera changed everything!

✨ Features:
- 33MP sensor
- 4K 60fps video
- Insane autofocus

The Sony A7 is perfect for content creators.

Get yours now! 👆`;

      const result = await processAffiliateLinks(script);

      expect(result.script).toContain('[Sony A7 IV](https://amzn.to/sonya7iv)');
      expect(result.linksInserted).toBeGreaterThan(0);
    });

    it('should handle errors gracefully', async () => {
      // Mock getDb to throw error
      const { getDb } = await import('../db');
      vi.mocked(getDb).mockRejectedValueOnce(new Error('Database error'));

      const script = 'Test script with iPhone';

      const result = await processAffiliateLinks(script);

      // Should return original script on error
      expect(result.script).toBe(script);
      expect(result.linksInserted).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in script', async () => {
      const script = 'iPhone!!! AirPods??? Sony A7... amazing!!!';

      const result = await processAffiliateLinks(script);

      expect(result.linksInserted).toBeGreaterThan(0);
    });

    it('should handle empty script', async () => {
      const script = '';

      const result = await processAffiliateLinks(script);

      expect(result.script).toBe('');
      expect(result.linksInserted).toBe(0);
    });

    it('should handle very long script', async () => {
      const script = `${'iPhone 15 Pro '.repeat(100)}is amazing!`;

      const result = await processAffiliateLinks(script);

      // Should only insert link once despite multiple mentions
      expect(result.linksInserted).toBe(1);
    });

    it('should handle unicode and emojis', async () => {
      const script = '🔥 iPhone 15 Pro 📱 is 🔥 amazing! 🎉';

      const result = await processAffiliateLinks(script);

      expect(result.script).toContain('[iPhone 15 Pro](https://amzn.to/iphone15pro)');
      expect(result.linksInserted).toBe(1);
    });
  });
});
