import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { scriptTemplates } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Templates router - handles script template retrieval
 */
export const templatesRouter = router({
  /**
   * Get all active script templates
   */
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const templates = await db
      .select()
      .from(scriptTemplates)
      .where(eq(scriptTemplates.isActive, 1))
      .orderBy(scriptTemplates.sortOrder);

    return templates;
  }),
});
