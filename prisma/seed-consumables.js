// prisma/seed-consumables.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding consumables...');

  // Optional: Clear existing data to avoid duplicates
  await prisma.consumable.deleteMany();

  // Seed data
  const consumables = [
    {
      name: 'Pringles (Original)',
      description: 'Crispy potato chips — perfect for game night.',
      language: 'en',
      image: '/images/pringles-original.jpg',
    },
    {
      name: 'Pringles (Paprika)',
      description: 'Snack croccante al gusto paprika.',
      language: 'it',
      image: '/images/pringles-paprika.jpg',
    },
    {
      name: 'MTG Booster Pack',
      description: '15 random Magic: The Gathering cards to spice up the evening.',
      language: 'en',
      image: '/images/mtg-booster.jpg',
    },
    {
      name: 'Coca-Cola (33cl)',
      description: 'Chilled soft drink to go with your movie or game.',
      language: 'en',
      image: '/images/coca-cola.jpg',
    },
    {
      name: 'Kinder Bueno',
      description: 'Barretta di cioccolato con crema di nocciole.',
      language: 'it',
      image: '/images/kinder-bueno.jpg',
    },
  ];

  await prisma.consumable.createMany({
    data: consumables,
  });

  console.log('✅ Consumables seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding consumables:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });