import { getDb } from '../db';
import { affiliateLinks } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Cache for affiliate links (refreshed every hour)
 */
let affiliateLinkCache: Array<{
  id: number;
  category: string;
  productName: string;
  amazonAsin: string;
  affiliateTag: string;
  affiliateUrl: string;
  keywords: string | null;
  isActive: boolean;
  createdAt: Date;
}> | null = null;

let lastCacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Get all active affiliate links from cache or database.
 */
async function getAffiliateLinks() {
  const now = Date.now();

  // Return cached links if still valid
  if (affiliateLinkCache && now - lastCacheTime < CACHE_DURATION) {
    return affiliateLinkCache;
  }

  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const links = await db
    .select()
    .from(affiliateLinks)
    .where(eq(affiliateLinks.isActive, true));

  affiliateLinkCache = links;
  lastCacheTime = now;

  return links;
}

/**
 * Extract equipment mentions from script using keyword matching.
 * Returns array of matched affiliate links.
 */
export async function findAffiliateMatches(script: string): Promise<
  Array<{
    productName: string;
    affiliateUrl: string;
    category: string;
    keywords: string[];
  }>
> {
  const links = await getAffiliateLinks();
  const matches: Array<{
    productName: string;
    affiliateUrl: string;
    category: string;
    keywords: string[];
  }> = [];

  const scriptLower = script.toLowerCase();

  for (const link of links) {
    if (!link.keywords) continue;

    const keywords = link.keywords.split(',').map((k) => k.trim().toLowerCase());

    // Check if any keyword appears in the script
    for (const keyword of keywords) {
      if (scriptLower.includes(keyword)) {
        matches.push({
          productName: link.productName,
          affiliateUrl: link.affiliateUrl,
          category: link.category,
          keywords,
        });
        break; // Only add once per product
      }
    }
  }

  return matches;
}

/**
 * Insert affiliate links into script.
 * Replaces equipment mentions with markdown links.
 */
export function insertAffiliateLinks(
  script: string,
  matches: Array<{
    productName: string;
    affiliateUrl: string;
    category: string;
    keywords: string[];
  }>
): { updatedScript: string; insertedCount: number } {
  let updatedScript = script;
  let insertedCount = 0;

  for (const match of matches) {
    // Create regex to find the keyword in the script (case-insensitive)
    for (const keyword of match.keywords) {
      // Only replace if not already a link
      const regex = new RegExp(`(?<!\\[)\\b${keyword}\\b(?!\\])`, 'gi');

      if (regex.test(updatedScript)) {
        updatedScript = updatedScript.replace(
          regex,
          `[${match.productName}](${match.affiliateUrl})`
        );
        insertedCount++;
        break; // Only replace once per product
      }
    }
  }

  return { updatedScript, insertedCount };
}

/**
 * Main function: Find and insert affiliate links into script.
 */
export async function processAffiliateLinks(script: string): Promise<{
  script: string;
  linksInserted: number;
}> {
  try {
    const matches = await findAffiliateMatches(script);
    const { updatedScript, insertedCount } = insertAffiliateLinks(script, matches);

    return {
      script: updatedScript,
      linksInserted: insertedCount,
    };
  } catch (error) {
    console.error('[AffiliateService] Error processing affiliate links:', error);
    // Return original script if processing fails
    return {
      script,
      linksInserted: 0,
    };
  }
}

/**
 * Invalidate cache (call after updating affiliate links).
 */
export function invalidateAffiliateCache() {
  affiliateLinkCache = null;
  lastCacheTime = 0;
}
