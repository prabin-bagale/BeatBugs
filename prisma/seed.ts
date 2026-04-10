import { db } from '../src/lib/db';

const GENRES = ['Hip-Hop', 'NepHop', 'Lo-Fi', 'Drill', 'Trap', 'R&B', 'Folk Fusion', 'Pop', 'Afrobeat'];
const MOODS = ['Dark', 'Chill', 'Aggressive', 'Melancholic', 'Energetic', 'Romantic', 'Mysterious', 'Uplifting'];
const KEYS = ['Am', 'Bbm', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m'];

const producers = [
  { id: 'p1', email: 'grimesaathi@beatbazaar.np', name: 'Grime Saathi', bio: 'NepHop pioneer blending traditional Nepali melodies with hard-hitting 808s. 5+ years in the scene.', avatar: 'https://picsum.photos/seed/producer1/200/200' },
  { id: 'p2', email: 'loksansar@beatbazaar.np', name: 'Lok Sansar', bio: 'Folk fusion specialist. Mixing sarangi samples with modern trap production.', avatar: 'https://picsum.photos/seed/producer2/200/200' },
  { id: 'p3', email: 'drrzbeats@beatbazaar.np', name: 'DRRZ Beats', bio: 'Nepali drill producer. Dark, cinematic soundscapes for the streets.', avatar: 'https://picsum.photos/seed/producer3/200/200' },
  { id: 'p4', email: 'melodykarki@beatbazaar.np', name: 'Melody Karki', bio: 'R&B and soul influenced. Smooth vibes for vocalists.', avatar: 'https://picsum.photos/seed/producer4/200/200' },
  { id: 'p5', email: 'beathimal@beatbazaar.np', name: 'Beat Himal', bio: 'High-energy trap beats. Known for viral TikTok hooks.', avatar: 'https://picsum.photos/seed/producer5/200/200' },
];

const buyers = [
  { id: 'b1', email: 'mc.everest@beatbazaar.np', name: 'MC Everest', bio: 'Rapper from Kathmandu', avatar: 'https://picsum.photos/seed/buyer1/200/200' },
  { id: 'b2', email: 'rhymestha@beatbazaar.np', name: 'Rhyme Thapa', bio: 'Indie hip-hop artist', avatar: 'https://picsum.photos/seed/buyer2/200/200' },
];

const beats = [
  { title: 'Kathmandu Nights', genre: 'NepHop', bpm: 85, key: 'Cm', mood: 'Dark', tags: '["nephop","dark","808","night"]', producerId: 'p1', coverSeed: 'kathmandu-nights', plays: 2847, sales: 34, basicPrice: 999, premiumPrice: 2999, exclusivePrice: 14999 },
  { title: 'Himalayan Drift', genre: 'Hip-Hop', bpm: 72, key: 'Am', mood: 'Chill', tags: '["chill","lofi","himalaya","ambient"]', producerId: 'p1', coverSeed: 'himalayan-drift', plays: 4521, sales: 56, basicPrice: 1299, premiumPrice: 3499, exclusivePrice: 19999 },
  { title: 'Temple Bells', genre: 'Folk Fusion', bpm: 90, key: 'Dm', mood: 'Mysterious', tags: '["folk","fusion","temple","nepali"]', producerId: 'p2', coverSeed: 'temple-bells', plays: 1893, sales: 22, basicPrice: 899, premiumPrice: 2499, exclusivePrice: 12999 },
  { title: 'Thamel Flow', genre: 'Trap', bpm: 140, key: 'Em', mood: 'Energetic', tags: '["trap","bouncy","club","nephop"]', producerId: 'p5', coverSeed: 'thamel-flow', plays: 6234, sales: 78, basicPrice: 1499, premiumPrice: 3999, exclusivePrice: 24999 },
  { title: 'Sarangi Dreams', genre: 'Lo-Fi', bpm: 75, key: 'Gm', mood: 'Melancholic', tags: '["lofi","sarangi","sad","study"]', producerId: 'p2', coverSeed: 'sarangi-dreams', plays: 3456, sales: 41, basicPrice: 799, premiumPrice: 2199, exclusivePrice: 10999 },
  { title: 'Street Poet', genre: 'Drill', bpm: 145, key: 'Bbm', mood: 'Aggressive', tags: '["drill","dark","uk","aggressive"]', producerId: 'p3', coverSeed: 'street-poet', plays: 5123, sales: 63, basicPrice: 1199, premiumPrice: 3299, exclusivePrice: 17999 },
  { title: 'Patan Vibe', genre: 'NepHop', bpm: 88, key: 'Fm', mood: 'Chill', tags: '["nephop","chill","patan","old-school"]', producerId: 'p1', coverSeed: 'patan-vibe', plays: 2156, sales: 28, basicPrice: 999, premiumPrice: 2799, exclusivePrice: 15999 },
  { title: 'Monsoon Rain', genre: 'R&B', bpm: 65, key: 'C#m', mood: 'Romantic', tags: '["rnb","romantic","rain","smooth"]', producerId: 'p4', coverSeed: 'monsoon-rain', plays: 3890, sales: 45, basicPrice: 1199, premiumPrice: 3299, exclusivePrice: 18999 },
  { title: 'Everest Bass', genre: 'Trap', bpm: 155, key: 'D#m', mood: 'Aggressive', tags: '["trap","hard","bass","808"]', producerId: 'p5', coverSeed: 'everest-bass', plays: 7102, sales: 92, basicPrice: 1599, premiumPrice: 4299, exclusivePrice: 27999 },
  { title: 'Pokhara Sunset', genre: 'Lo-Fi', bpm: 80, key: 'Am', mood: 'Chill', tags: '["lofi","sunset","chill","peaceful"]', producerId: 'p4', coverSeed: 'pokhara-sunset', plays: 2567, sales: 31, basicPrice: 899, premiumPrice: 2499, exclusivePrice: 12999 },
  { title: 'Basement Cypher', genre: 'Hip-Hop', bpm: 92, key: 'Cm', mood: 'Energetic', tags: '["hiphop","cypher","boom-bap","classic"]', producerId: 'p1', coverSeed: 'basement-cypher', plays: 1987, sales: 19, basicPrice: 899, premiumPrice: 2599, exclusivePrice: 13999 },
  { title: 'Nepal Drill', genre: 'Drill', bpm: 142, key: 'Em', mood: 'Aggressive', tags: '["drill","nepal","dark","street"]', producerId: 'p3', coverSeed: 'nepal-drill', plays: 4567, sales: 54, basicPrice: 1399, premiumPrice: 3699, exclusivePrice: 21999 },
  { title: 'Prayer Beats', genre: 'Folk Fusion', bpm: 78, key: 'Gm', mood: 'Uplifting', tags: '["folk","spiritual","nepali","chant"]', producerId: 'p2', coverSeed: 'prayer-beats', plays: 1345, sales: 15, basicPrice: 799, premiumPrice: 2199, exclusivePrice: 9999 },
  { title: 'Midnight Run', genre: 'NepHop', bpm: 95, key: 'Bm', mood: 'Mysterious', tags: '["nephop","night","mysterious","dark"]', producerId: 'p3', coverSeed: 'midnight-run', plays: 2890, sales: 37, basicPrice: 1099, premiumPrice: 3099, exclusivePrice: 16999 },
  { title: 'Dholak Trap', genre: 'Folk Fusion', bpm: 130, key: 'Dm', mood: 'Energetic', tags: '["folk","trap","dholak","fusion"]', producerId: 'p2', coverSeed: 'dholak-trap', plays: 3789, sales: 48, basicPrice: 1199, premiumPrice: 3299, exclusivePrice: 17999 },
  { title: 'Cloud 9', genre: 'R&B', bpm: 70, key: 'F#m', mood: 'Romantic', tags: '["rnb","romantic","smooth","vocal"]', producerId: 'p4', coverSeed: 'cloud-9', plays: 2012, sales: 24, basicPrice: 999, premiumPrice: 2899, exclusivePrice: 14999 },
  { title: 'Yabesh Type Beat', genre: 'NepHop', bpm: 84, key: 'Cm', mood: 'Melancholic', tags: '["yabesh-thapa","type-beat","nephop","sad"]', producerId: 'p1', coverSeed: 'yabesh-type', plays: 8934, sales: 112, basicPrice: 1799, premiumPrice: 4999, exclusivePrice: 29999 },
  { title: 'Bounced', genre: 'Afrobeat', bpm: 110, key: 'Am', mood: 'Energetic', tags: '["afrobeat","bouncy","dance","party"]', producerId: 'p5', coverSeed: 'bounced', plays: 5678, sales: 67, basicPrice: 1299, premiumPrice: 3599, exclusivePrice: 19999 },
];

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await db.order.deleteMany();
  await db.beat.deleteMany();
  await db.user.deleteMany();

  // Create producers
  for (const p of producers) {
    await db.user.create({
      data: {
        id: p.id,
        email: p.email,
        name: p.name,
        role: 'producer',
        bio: p.bio,
        avatar: p.avatar,
        verified: true,
      },
    });
  }

  // Create buyers
  for (const b of buyers) {
    await db.user.create({
      data: {
        id: b.id,
        email: b.email,
        name: b.name,
        role: 'buyer',
        bio: b.bio,
        avatar: b.avatar,
      },
    });
  }

  // Create beats
  for (const b of beats) {
    await db.beat.create({
      data: {
        title: b.title,
        description: `${b.genre} beat in ${b.key} at ${b.bpm} BPM. ${b.mood} vibe. Perfect for your next track.`,
        genre: b.genre,
        bpm: b.bpm,
        key: b.key,
        mood: b.mood,
        tags: b.tags,
        coverUrl: `https://picsum.photos/seed/${b.coverSeed}/600/600`,
        audioPreviewUrl: `/audio/${b.coverSeed}.mp3`,
        audioFileUrl: `/audio/${b.coverSeed}-full.wav`,
        plays: b.plays,
        sales: b.sales,
        basicPrice: b.basicPrice,
        premiumPrice: b.premiumPrice,
        exclusivePrice: b.exclusivePrice,
        producerId: b.producerId,
      },
    });
  }

  // Create some orders
  const sampleOrders = [
    { buyerId: 'b1', beatId: beats[0]!.producerId === 'p1' ? beats[0]!.id : '', licenseType: 'premium', amount: 2999 },
  ];
  // Find first beat from p1
  const firstBeat = await db.beat.findFirst({ where: { producerId: 'p1' } });
  if (firstBeat) {
    await db.order.create({
      data: {
        buyerId: 'b1',
        beatId: firstBeat.id,
        licenseType: 'premium',
        amount: firstBeat.premiumPrice,
        status: 'completed',
        paymentMethod: 'esewa',
      },
    });
  }

  const secondBeat = await db.beat.findFirst({ where: { producerId: 'p3' } });
  if (secondBeat) {
    await db.order.create({
      data: {
        buyerId: 'b2',
        beatId: secondBeat.id,
        licenseType: 'basic',
        amount: secondBeat.basicPrice,
        status: 'completed',
        paymentMethod: 'khalti',
      },
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
