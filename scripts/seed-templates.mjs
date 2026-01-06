import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { mysqlTable, int, varchar, text, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';

// Define scriptTemplates table inline
const scriptTemplates = mysqlTable("script_templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  defaultTone: mysqlEnum("defaultTone", ["professional", "casual", "humorous"]).default("casual").notNull(),
  topicPlaceholder: text("topicPlaceholder").notNull(),
  exampleTopic: text("exampleTopic").notNull(),
  icon: varchar("icon", { length: 10 }).default("📝").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

const templates = [
  {
    name: "The 'Link in Bio' Teaser",
    description: "Perfekt für OF-Creator & Coaches. Baut Spannung auf, ohne zu viel zu verraten.",
    category: "Marketing",
    defaultTone: "casual",
    topicPlaceholder: "z.B. Mein exklusives Shooting, Mein neuer Workout-Plan",
    exampleTopic: "Das Shooting am Strand, das ich fast nicht gepostet hätte",
    icon: "🤫",
    sortOrder: 1,
    isActive: 1,
  },
  {
    name: "Storytime & Reveal",
    description: "Erzähle eine persönliche Story mit einem Twist am Ende.",
    category: "Entertainment",
    defaultTone: "casual",
    topicPlaceholder: "z.B. Ein verrücktes Fan-Erlebnis, Ein Fail beim Dreh",
    exampleTopic: "Die verrückteste DM, die ich je bekommen habe",
    icon: "📖",
    sortOrder: 2,
    isActive: 1,
  },
  {
    name: "Educational Hook",
    description: "Klassischer Mehrwert-Content um Vertrauen aufzubauen.",
    category: "Education",
    defaultTone: "professional",
    topicPlaceholder: "z.B. 3 Tipps für bessere Selfies, Wie ich Geld verdiene",
    exampleTopic: "3 Tipps für perfektes Lighting mit dem Smartphone",
    icon: "💡",
    sortOrder: 3,
    isActive: 1,
  }
];

async function seed() {
  console.log('[Seed] Starting script templates seed...');
  
  // Create database connection
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);
  
  try {
    // Clear existing templates first (optional - remove if you want to keep old ones)
    await connection.execute('DELETE FROM script_templates');
    console.log('[Seed] Cleared existing templates');
    
    for (const template of templates) {
      await db.insert(scriptTemplates).values(template);
      console.log(`[Seed] ✓ Added template: ${template.name}`);
    }
    
    console.log('[Seed] ✅ Successfully seeded', templates.length, 'script templates');
  } catch (error) {
    console.error('[Seed] ❌ Error seeding templates:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
