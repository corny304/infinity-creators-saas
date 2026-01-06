import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Define scriptTemplates table inline (to avoid import issues)
const scriptTemplates = {
  id: 'id',
  name: 'name',
  description: 'description',
  category: 'category',
  defaultTone: 'defaultTone',
  topicPlaceholder: 'topicPlaceholder',
  exampleTopic: 'exampleTopic',
  icon: 'icon',
  sortOrder: 'sortOrder',
  isActive: 'isActive',
  createdAt: 'createdAt',
};

const templates = [
  {
    name: "Story-Poll Engagement (Morning)",
    description: "Interaktive Story-Idee für maximale Bindung am Morgen (aus dem 30-Tage-Plan).",
    category: "Engagement",
    defaultTone: "casual",
    topicPlaceholder: "z.B. Outfit-Wahl, Kaffee oder Tee, Gym oder Restday",
    exampleTopic: "Soll ich heute das rote oder schwarze Set tragen?",
    icon: "☕",
    sortOrder: 1,
    isActive: 1,
  },
  {
    name: "PPV Upsell Teaser",
    description: "Verkaufspsychologischer Text für Pay-Per-View Nachrichten (Hohe Conversion).",
    category: "Sales",
    defaultTone: "professional",
    topicPlaceholder: "z.B. Exklusives Video, Dusch-Szene, 5-Minuten-Clip",
    exampleTopic: "Mein unzensiertes Dusch-Video von heute Morgen",
    icon: "💰",
    sortOrder: 2,
    isActive: 1,
  },
  {
    name: "The 'Link in Bio' Funnel",
    description: "TikTok/Reels Skript, das User neugierig auf OnlyFans macht (Safe for Work).",
    category: "Marketing",
    defaultTone: "humorous",
    topicPlaceholder: "z.B. Ein Geheimnis verraten, Behind the Scenes",
    exampleTopic: "Was ich meinen Eltern über meinen Job erzähle",
    icon: "🤫",
    sortOrder: 3,
    isActive: 1,
  },
  {
    name: "Late Night Voice Note",
    description: "Skript für eine intime Sprachnachricht zur Kundenbindung.",
    category: "Intimacy",
    defaultTone: "casual",
    topicPlaceholder: "z.B. Gute Nacht wünschen, Gedanken im Bett",
    exampleTopic: "Ich kann nicht schlafen und denke an dich",
    icon: "🎙️",
    sortOrder: 4,
    isActive: 1,
  },
  {
    name: "The 'Link in Bio' Teaser",
    description: "Perfect for OF creators & coaches - creates curiosity without revealing too much",
    category: "Marketing",
    defaultTone: "casual",
    topicPlaceholder: "e.g., exclusive content, behind-the-scenes, secret tip",
    exampleTopic: "The one thing I can't show here (link in bio)",
    icon: "🤫",
    sortOrder: 5,
    isActive: 1,
  },
  {
    name: "Storytime & Reveal",
    description: "Personal story with a twist - builds emotional connection",
    category: "Entertainment",
    defaultTone: "casual",
    topicPlaceholder: "e.g., embarrassing moment, life lesson, plot twist",
    exampleTopic: "The day I quit my 9-5 to become a creator",
    icon: "📖",
    sortOrder: 6,
    isActive: 1,
  },
  {
    name: "Educational Hook",
    description: "Provide value first, build trust - great for coaches & experts",
    category: "Education",
    defaultTone: "professional",
    topicPlaceholder: "e.g., productivity tip, fitness advice, money hack",
    exampleTopic: "3 mistakes killing your Instagram growth",
    icon: "💡",
    sortOrder: 7,
    isActive: 1,
  },
];

try {
  console.log('🌱 Seeding OF-specific script templates...');

  // Clear existing templates
  await connection.execute('DELETE FROM script_templates');
  console.log('✅ Cleared existing templates');

  // Insert new templates
  for (const template of templates) {
    await connection.execute(
      `INSERT INTO script_templates (name, description, category, defaultTone, topicPlaceholder, exampleTopic, icon, sortOrder, isActive, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        template.name,
        template.description,
        template.category,
        template.defaultTone,
        template.topicPlaceholder,
        template.exampleTopic,
        template.icon,
        template.sortOrder,
        template.isActive,
      ]
    );
  }

  console.log(`✅ Seeded ${templates.length} OF-specific templates successfully!`);
  console.log('\nTemplates:');
  templates.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.icon} ${t.name} (${t.category})`);
  });

} catch (error) {
  console.error('❌ Error seeding templates:', error);
  process.exit(1);
} finally {
  await connection.end();
  process.exit(0);
}
