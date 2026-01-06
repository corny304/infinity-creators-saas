import { drizzle } from 'drizzle-orm/mysql2';
import { affiliateLinks } from '../drizzle/schema.js';

const db = drizzle(process.env.DATABASE_URL);

const AFFILIATE_LINKS = [
  {
    category: 'microphone',
    productName: 'Audio-Technica AT2020',
    amazonAsin: 'B00051E7AE',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amazon.com/Audio-Technica-AT2020-Cardioid-Condenser-Microphone/dp/B00051E7AE?tag=infinitycreators-20',
    keywords: 'microphone,usb,recording,podcast,audio,at2020',
  },
  {
    category: 'lighting',
    productName: 'Neewer LED Ring Light',
    amazonAsin: 'B01LXMBHVG',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amazon.com/Neewer-Dimmable-Lighting-YouTube-Streaming/dp/B01LXMBHVG?tag=infinitycreators-20',
    keywords: 'ring light,led,lighting,softbox,neewer',
  },
  {
    category: 'camera',
    productName: 'Sony ZV-1',
    amazonAsin: 'B08BYKNBQ1',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amazon.com/Sony-ZV-1-Compact-Camera-Vlogging/dp/B08BYKNBQ1?tag=infinitycreators-20',
    keywords: 'camera,vlogging,compact,4k,sony,zv-1',
  },
  {
    category: 'tripod',
    productName: 'Manfrotto Compact Action Tripod',
    amazonAsin: 'B00HQTJYXU',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amazon.com/Manfrotto-Compact-Action-Tripod-MKCOMPACTLT/dp/B00HQTJYXU?tag=infinitycreators-20',
    keywords: 'tripod,stand,mount,manfrotto,compact',
  },
  {
    category: 'microphone',
    productName: 'Blue Yeti USB Microphone',
    amazonAsin: 'B00N1YPXW8',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amazon.com/Blue-Yeti-USB-Microphone-Streaming/dp/B00N1YPXW8?tag=infinitycreators-20',
    keywords: 'blue yeti,microphone,usb,streaming,podcast,recording',
  },
  {
    category: 'lighting',
    productName: 'Elgato Key Light',
    amazonAsin: 'B07L755X39',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amazon.com/Elgato-Key-Light-Professional-App-Controlled/dp/B07L755X39?tag=infinitycreators-20',
    keywords: 'key light,elgato,led,lighting,streaming',
  },
  {
    category: 'background',
    productName: 'Neewer Green Screen Backdrop',
    amazonAsin: 'B00I2YQZTA',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amazon.com/Neewer-Photography-Background-Screen-Backdrop/dp/B00I2YQZTA?tag=infinitycreators-20',
    keywords: 'green screen,backdrop,background,chroma key',
  },
  {
    category: 'audio',
    productName: 'Rode Wireless GO II',
    amazonAsin: 'B08GXBSM2V',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amazon.com/Rode-Wireless-Microphone-Content-Creators/dp/B08GXBSM2V?tag=infinitycreators-20',
    keywords: 'rode,wireless,microphone,lavalier,audio',
  },
  {
    category: 'camera',
    productName: 'DJI Osmo Pocket 3',
    amazonAsin: 'B0BQXVS8VF',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amazon.com/DJI-Osmo-Pocket-Stabilization-Handheld/dp/B0BQXVS8VF?tag=infinitycreators-20',
    keywords: 'dji,osmo,gimbal,camera,stabilization,pocket',
  },
  {
    category: 'lighting',
    productName: 'Godox SL-60W LED Video Light',
    amazonAsin: 'B07QRFX9RX',
    affiliateTag: 'infinitycreators-20',
    affiliateUrl: 'https://amazon.com/Godox-SL-60W-Daylight-Video-Lighting/dp/B07QRFX9RX?tag=infinitycreators-20',
    keywords: 'godox,led,video light,lighting,studio',
  },
];

async function seedAffiliateLinks() {
  try {
    console.log('Seeding affiliate links...');

    for (const link of AFFILIATE_LINKS) {
      await db.insert(affiliateLinks).values(link);
      console.log(`✓ Added: ${link.productName}`);
    }

    console.log('✅ Affiliate links seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding affiliate links:', error);
    process.exit(1);
  }
}

seedAffiliateLinks();
