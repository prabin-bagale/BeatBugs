import { db } from './db'

const USERS = [
  { id: 'p1', email: 'grimesaathi@beatbazaar.np', name: 'Grime Saathi', role: 'producer', avatar: 'https://picsum.photos/seed/producer1/200/200', bio: 'NepHop pioneer blending traditional Nepali melodies with hard-hitting 808s. 5+ years in the scene.', verified: true },
  { id: 'p2', email: 'loksansar@beatbazaar.np', name: 'Lok Sansar', role: 'producer', avatar: 'https://picsum.photos/seed/producer2/200/200', bio: 'Folk fusion specialist. Mixing sarangi samples with modern trap production.', verified: true },
  { id: 'p3', email: 'drrzbeats@beatbazaar.np', name: 'DRRZ Beats', role: 'producer', avatar: 'https://picsum.photos/seed/producer3/200/200', bio: 'Nepali drill producer. Dark, cinematic soundscapes for the streets.', verified: true },
  { id: 'p4', email: 'melodykarki@beatbazaar.np', name: 'Melody Karki', role: 'producer', avatar: 'https://picsum.photos/seed/producer4/200/200', bio: 'R&B and soul influenced. Smooth vibes for vocalists.', verified: true },
  { id: 'p5', email: 'beathimal@beatbazaar.np', name: 'Beat Himal', role: 'producer', avatar: 'https://picsum.photos/seed/producer5/200/200', bio: 'High-energy trap beats. Known for viral TikTok hooks.', verified: true },
  { id: 'b1', email: 'mc.everest@beatbazaar.np', name: 'MC Everest', role: 'buyer', avatar: 'https://picsum.photos/seed/buyer1/200/200', bio: 'Rapper from Kathmandu', verified: false },
  { id: 'b2', email: 'rhymestha@beatbazaar.np', name: 'Rhyme Thapa', role: 'buyer', avatar: 'https://picsum.photos/seed/buyer2/200/200', bio: 'Indie hip-hop artist', verified: false },
]

const BEATS = [
  { id: 'seed1', title: 'Kathmandu Nights', description: 'NepHop beat in Cm at 85 BPM. Dark vibe.', genre: 'NepHop', bpm: 85, key: 'Cm', mood: 'Dark', tags: '["nephop","dark","808","night"]', coverUrl: 'https://picsum.photos/seed/kathmandu-nights/600/600', audioPreviewUrl: '', plays: 2847, sales: 34, basicPrice: 999, premiumPrice: 2999, exclusivePrice: 14999, producerId: 'p1' },
  { id: 'seed2', title: 'Himalayan Drift', description: 'Hip-Hop beat in Am at 72 BPM. Chill vibe.', genre: 'Hip-Hop', bpm: 72, key: 'Am', mood: 'Chill', tags: '["chill","lofi","himalaya","ambient"]', coverUrl: 'https://picsum.photos/seed/himalayan-drift/600/600', audioPreviewUrl: '', plays: 4521, sales: 56, basicPrice: 1299, premiumPrice: 3499, exclusivePrice: 19999, producerId: 'p1' },
  { id: 'seed3', title: 'Temple Bells', description: 'Folk Fusion beat in Dm at 90 BPM. Mysterious vibe.', genre: 'Folk Fusion', bpm: 90, key: 'Dm', mood: 'Mysterious', tags: '["folk","fusion","temple","nepali"]', coverUrl: 'https://picsum.photos/seed/temple-bells/600/600', audioPreviewUrl: '', plays: 1893, sales: 22, basicPrice: 899, premiumPrice: 2499, exclusivePrice: 12999, producerId: 'p2' },
  { id: 'seed4', title: 'Thamel Flow', description: 'Trap beat in Em at 140 BPM. Energetic vibe.', genre: 'Trap', bpm: 140, key: 'Em', mood: 'Energetic', tags: '["trap","bouncy","club","nephop"]', coverUrl: 'https://picsum.photos/seed/thamel-flow/600/600', audioPreviewUrl: '', plays: 6234, sales: 78, basicPrice: 1499, premiumPrice: 3999, exclusivePrice: 24999, producerId: 'p5' },
  { id: 'seed5', title: 'Sarangi Dreams', description: 'Lo-Fi beat in Gm at 75 BPM. Melancholic vibe.', genre: 'Lo-Fi', bpm: 75, key: 'Gm', mood: 'Melancholic', tags: '["lofi","sarangi","sad","study"]', coverUrl: 'https://picsum.photos/seed/sarangi-dreams/600/600', audioPreviewUrl: '', plays: 3456, sales: 41, basicPrice: 799, premiumPrice: 2199, exclusivePrice: 10999, producerId: 'p2' },
  { id: 'seed6', title: 'Street Poet', description: 'Drill beat in Bbm at 145 BPM. Aggressive vibe.', genre: 'Drill', bpm: 145, key: 'Bbm', mood: 'Aggressive', tags: '["drill","dark","uk","aggressive"]', coverUrl: 'https://picsum.photos/seed/street-poet/600/600', audioPreviewUrl: '', plays: 5123, sales: 63, basicPrice: 1199, premiumPrice: 3299, exclusivePrice: 17999, producerId: 'p3' },
  { id: 'seed7', title: 'Patan Vibe', description: 'NepHop beat in Fm at 88 BPM. Chill vibe.', genre: 'NepHop', bpm: 88, key: 'Fm', mood: 'Chill', tags: '["nephop","chill","patan","old-school"]', coverUrl: 'https://picsum.photos/seed/patan-vibe/600/600', audioPreviewUrl: '', plays: 2156, sales: 28, basicPrice: 999, premiumPrice: 2799, exclusivePrice: 15999, producerId: 'p1' },
  { id: 'seed8', title: 'Monsoon Rain', description: 'R&B beat in C#m at 65 BPM. Romantic vibe.', genre: 'R&B', bpm: 65, key: 'C#m', mood: 'Romantic', tags: '["rnb","romantic","rain","smooth"]', coverUrl: 'https://picsum.photos/seed/monsoon-rain/600/600', audioPreviewUrl: '', plays: 3890, sales: 45, basicPrice: 1199, premiumPrice: 3299, exclusivePrice: 18999, producerId: 'p4' },
  { id: 'seed9', title: 'Everest Bass', description: 'Trap beat in D#m at 155 BPM. Aggressive vibe.', genre: 'Trap', bpm: 155, key: 'D#m', mood: 'Aggressive', tags: '["trap","hard","bass","808"]', coverUrl: 'https://picsum.photos/seed/everest-bass/600/600', audioPreviewUrl: '', plays: 7102, sales: 92, basicPrice: 1599, premiumPrice: 4299, exclusivePrice: 27999, producerId: 'p5' },
  { id: 'seed10', title: 'Pokhara Sunset', description: 'Lo-Fi beat in Am at 80 BPM. Chill vibe.', genre: 'Lo-Fi', bpm: 80, key: 'Am', mood: 'Chill', tags: '["lofi","sunset","chill","peaceful"]', coverUrl: 'https://picsum.photos/seed/pokhara-sunset/600/600', audioPreviewUrl: '', plays: 2567, sales: 31, basicPrice: 899, premiumPrice: 2499, exclusivePrice: 12999, producerId: 'p4' },
  { id: 'seed11', title: 'Basement Cypher', description: 'Hip-Hop beat in Cm at 92 BPM. Energetic vibe.', genre: 'Hip-Hop', bpm: 92, key: 'Cm', mood: 'Energetic', tags: '["hiphop","cypher","boom-bap","classic"]', coverUrl: 'https://picsum.photos/seed/basement-cypher/600/600', audioPreviewUrl: '', plays: 1987, sales: 19, basicPrice: 899, premiumPrice: 2599, exclusivePrice: 13999, producerId: 'p1' },
  { id: 'seed12', title: 'Nepal Drill', description: 'Drill beat in Em at 142 BPM. Aggressive vibe.', genre: 'Drill', bpm: 142, key: 'Em', mood: 'Aggressive', tags: '["drill","nepal","dark","street"]', coverUrl: 'https://picsum.photos/seed/nepal-drill/600/600', audioPreviewUrl: '', plays: 4567, sales: 54, basicPrice: 1399, premiumPrice: 3699, exclusivePrice: 21999, producerId: 'p3' },
  { id: 'seed13', title: 'Prayer Beats', description: 'Folk Fusion beat in Gm at 78 BPM. Uplifting vibe.', genre: 'Folk Fusion', bpm: 78, key: 'Gm', mood: 'Uplifting', tags: '["folk","spiritual","nepali","chant"]', coverUrl: 'https://picsum.photos/seed/prayer-beats/600/600', audioPreviewUrl: '', plays: 1345, sales: 15, basicPrice: 799, premiumPrice: 2199, exclusivePrice: 9999, producerId: 'p2' },
  { id: 'seed14', title: 'Midnight Run', description: 'NepHop beat in Bm at 95 BPM. Mysterious vibe.', genre: 'NepHop', bpm: 95, key: 'Bm', mood: 'Mysterious', tags: '["nephop","night","mysterious","dark"]', coverUrl: 'https://picsum.photos/seed/midnight-run/600/600', audioPreviewUrl: '', plays: 2890, sales: 37, basicPrice: 1099, premiumPrice: 3099, exclusivePrice: 16999, producerId: 'p3' },
  { id: 'seed15', title: 'Dholak Trap', description: 'Folk Fusion beat in Dm at 130 BPM. Energetic vibe.', genre: 'Folk Fusion', bpm: 130, key: 'Dm', mood: 'Energetic', tags: '["folk","trap","dholak","fusion"]', coverUrl: 'https://picsum.photos/seed/dholak-trap/600/600', audioPreviewUrl: '', plays: 3789, sales: 48, basicPrice: 1199, premiumPrice: 3299, exclusivePrice: 17999, producerId: 'p2' },
  { id: 'seed16', title: 'Cloud 9', description: 'R&B beat in F#m at 70 BPM. Romantic vibe.', genre: 'R&B', bpm: 70, key: 'F#m', mood: 'Romantic', tags: '["rnb","romantic","smooth","vocal"]', coverUrl: 'https://picsum.photos/seed/cloud-9/600/600', audioPreviewUrl: '', plays: 2012, sales: 24, basicPrice: 999, premiumPrice: 2899, exclusivePrice: 14999, producerId: 'p4' },
  { id: 'seed17', title: 'Yabesh Type Beat', description: 'NepHop beat in Cm at 84 BPM. Melancholic vibe.', genre: 'NepHop', bpm: 84, key: 'Cm', mood: 'Melancholic', tags: '["yabesh-thapa","type-beat","nephop","sad"]', coverUrl: 'https://picsum.photos/seed/yabesh-type/600/600', audioPreviewUrl: '', plays: 8934, sales: 112, basicPrice: 1799, premiumPrice: 4999, exclusivePrice: 29999, producerId: 'p1' },
  { id: 'seed18', title: 'Bounced', description: 'Afrobeat beat in Am at 110 BPM. Energetic vibe.', genre: 'Afrobeat', bpm: 110, key: 'Am', mood: 'Energetic', tags: '["afrobeat","bouncy","dance","party"]', coverUrl: 'https://picsum.photos/seed/bounced/600/600', audioPreviewUrl: '', plays: 5678, sales: 67, basicPrice: 1299, premiumPrice: 3599, exclusivePrice: 19999, producerId: 'p5' },
]

const ORDERS = [
  { id: 'ord1', buyerId: 'b1', beatId: 'seed1', licenseType: 'premium', amount: 2999, currency: 'NPR', status: 'completed', paymentMethod: 'esewa' },
  { id: 'ord2', buyerId: 'b2', beatId: 'seed6', licenseType: 'basic', amount: 1199, currency: 'NPR', status: 'completed', paymentMethod: 'khalti' },
]

let seedPromise: Promise<void> | null = null
let seeded = false

export async function ensureSeeded() {
  if (seeded) return
  if (seedPromise) return seedPromise

  seedPromise = (async () => {
    try {
      // Check if User table exists by trying a raw query
      let needsSchema = false
      try {
        await db.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' AND name='User'`
      } catch {
        needsSchema = true
      }

      if (needsSchema) {
        console.log('[seed] Creating database schema...')
        try {
          // Each statement must be executed separately (Prisma doesn't support multi-statement)
          const statements = [
            `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL, "name" TEXT NOT NULL, "role" TEXT NOT NULL DEFAULT 'buyer', "avatar" TEXT, "bio" TEXT, "verified" BOOLEAN NOT NULL DEFAULT 0, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`,
            `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
            `CREATE TABLE IF NOT EXISTS "Beat" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "description" TEXT, "genre" TEXT NOT NULL, "subGenre" TEXT, "bpm" INTEGER NOT NULL, "key" TEXT NOT NULL DEFAULT 'Cm', "mood" TEXT, "tags" TEXT NOT NULL DEFAULT '[]', "coverUrl" TEXT NOT NULL, "audioPreviewUrl" TEXT NOT NULL, "audioFileUrl" TEXT, "plays" INTEGER NOT NULL DEFAULT 0, "sales" INTEGER NOT NULL DEFAULT 0, "status" TEXT NOT NULL DEFAULT 'active', "exclusiveSold" BOOLEAN NOT NULL DEFAULT 0, "basicPrice" REAL NOT NULL DEFAULT 999, "premiumPrice" REAL NOT NULL DEFAULT 2999, "exclusivePrice" REAL NOT NULL DEFAULT 9999, "producerId" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, FOREIGN KEY ("producerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
            `CREATE INDEX IF NOT EXISTS "Beat_producerId_idx" ON "Beat"("producerId")`,
            `CREATE TABLE IF NOT EXISTS "Order" ("id" TEXT NOT NULL PRIMARY KEY, "buyerId" TEXT NOT NULL, "beatId" TEXT NOT NULL, "licenseType" TEXT NOT NULL, "amount" REAL NOT NULL, "currency" TEXT NOT NULL DEFAULT 'NPR', "status" TEXT NOT NULL DEFAULT 'completed', "paymentMethod" TEXT NOT NULL DEFAULT 'esewa', "licensePdfUrl" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE, FOREIGN KEY ("beatId") REFERENCES "Beat"("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
            `CREATE INDEX IF NOT EXISTS "Order_buyerId_idx" ON "Order"("buyerId")`,
            `CREATE INDEX IF NOT EXISTS "Order_beatId_idx" ON "Order"("beatId")`,
          ]
          for (const sql of statements) {
            await db.$executeRawUnsafe(sql)
          }
          console.log('[seed] Schema created successfully')
        } catch (e) {
          console.error('[seed] Schema creation failed:', e)
          seedPromise = null
          return
        }
      }

      const count = await db.user.count()
      if (count > 0) {
        seeded = true
        return
      }

      console.log('[seed] Database is empty, seeding...')

      // Create users
      for (const user of USERS) {
        await db.user.upsert({
          where: { id: user.id },
          update: {},
          create: user,
        }).catch(() => {})
      }

      // Create beats
      for (const beat of BEATS) {
        await db.beat.create({
          data: beat,
        }).catch(() => {})
      }

      // Create orders
      for (const order of ORDERS) {
        await db.order.create({
          data: order,
        }).catch(() => {})
      }

      console.log('[seed] Database seeded successfully')
      seeded = true
    } catch (error) {
      console.error('[seed] Seeding failed:', error)
      seedPromise = null
    }
  })()

  return seedPromise
}
