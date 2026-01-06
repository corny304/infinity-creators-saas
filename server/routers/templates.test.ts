import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from '../routers';
import { getDb } from '../db';
import { scriptTemplates } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Templates Router', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(async () => {
    // Create a test caller with minimal context
    caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });
  });

  describe('templates.list', () => {
    it('should return all active templates', async () => {
      const templates = await caller.templates.list();

      expect(templates).toBeDefined();
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should return templates with correct structure', async () => {
      const templates = await caller.templates.list();

      templates.forEach(template => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('category');
        expect(template).toHaveProperty('defaultTone');
        expect(template).toHaveProperty('topicPlaceholder');
        expect(template).toHaveProperty('exampleTopic');
        expect(template).toHaveProperty('icon');
        expect(template).toHaveProperty('sortOrder');
        expect(template).toHaveProperty('isActive');
      });
    });

    it('should only return active templates (isActive = 1)', async () => {
      const templates = await caller.templates.list();

      templates.forEach(template => {
        expect(template.isActive).toBe(1);
      });
    });

    it('should return templates ordered by sortOrder', async () => {
      const templates = await caller.templates.list();

      for (let i = 1; i < templates.length; i++) {
        expect(templates[i].sortOrder).toBeGreaterThanOrEqual(templates[i - 1].sortOrder);
      }
    });

    it('should include the "Link in Bio Teaser" template', async () => {
      const templates = await caller.templates.list();

      const linkInBioTemplate = templates.find(t => t.name === "The 'Link in Bio' Teaser");
      expect(linkInBioTemplate).toBeDefined();
      expect(linkInBioTemplate?.category).toBe('Marketing');
      expect(linkInBioTemplate?.icon).toBe('🤫');
      expect(linkInBioTemplate?.defaultTone).toBe('casual');
    });

    it('should include the "Storytime & Reveal" template', async () => {
      const templates = await caller.templates.list();

      const storytimeTemplate = templates.find(t => t.name === 'Storytime & Reveal');
      expect(storytimeTemplate).toBeDefined();
      expect(storytimeTemplate?.category).toBe('Entertainment');
      expect(storytimeTemplate?.icon).toBe('📖');
      expect(storytimeTemplate?.defaultTone).toBe('casual');
    });

    it('should include the "Educational Hook" template', async () => {
      const templates = await caller.templates.list();

      const educationalTemplate = templates.find(t => t.name === 'Educational Hook');
      expect(educationalTemplate).toBeDefined();
      expect(educationalTemplate?.category).toBe('Education');
      expect(educationalTemplate?.icon).toBe('💡');
      expect(educationalTemplate?.defaultTone).toBe('professional');
    });

    it('should have valid placeholder text for all templates', async () => {
      const templates = await caller.templates.list();

      templates.forEach(template => {
        expect(template.topicPlaceholder).toBeTruthy();
        expect(template.topicPlaceholder.length).toBeGreaterThan(0);
      });
    });

    it('should have valid example topics for all templates', async () => {
      const templates = await caller.templates.list();

      templates.forEach(template => {
        expect(template.exampleTopic).toBeTruthy();
        expect(template.exampleTopic.length).toBeGreaterThan(0);
      });
    });

    it('should have valid tone values', async () => {
      const templates = await caller.templates.list();
      const validTones = ['professional', 'casual', 'humorous'];

      templates.forEach(template => {
        expect(validTones).toContain(template.defaultTone);
      });
    });
  });

  describe('Template Database Integration', () => {
    it('should be able to query templates directly from database', async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const templates = await db
        .select()
        .from(scriptTemplates)
        .where(eq(scriptTemplates.isActive, 1));

      expect(templates).toBeDefined();
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should have unique sortOrder values for proper ordering', async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const templates = await db
        .select()
        .from(scriptTemplates)
        .where(eq(scriptTemplates.isActive, 1));

      const sortOrders = templates.map(t => t.sortOrder);
      const uniqueSortOrders = new Set(sortOrders);

      // All templates should have unique sortOrder values
      expect(uniqueSortOrders.size).toBe(sortOrders.length);
    });
  });
});
