const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  // Step 1: Wipe data in correct dependency order
  await prisma.intentProduct.deleteMany();
  await prisma.intent.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productInstance.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.productRequest.deleteMany();
  await prisma.deliverySlot.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.city.deleteMany();

  // Step 2: Seed categories
  const categories = [
    { slug: 'board-game', name: 'Board Game', type: 'ENTERTAINMENT' },
    { slug: 'video-game', name: 'Video Game', type: 'ENTERTAINMENT' },
    { slug: 'book', name: 'Book', type: 'ENTERTAINMENT' },
    { slug: 'film', name: 'Film', type: 'ENTERTAINMENT' },
    { slug: 'snack', name: 'Snack', type: 'CONSUMABLE' },
    { slug: 'drink', name: 'Drink', type: 'CONSUMABLE' }
  ];

  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.productCategory.create({ data: cat });
    categoryMap[cat.slug] = created.id;
  }

  // Step 3: Seed products
  const rawProducts = [
    {
      name: 'Catan',
      value: 3500,
      imageUrl: 'https://example.com/images/catan.jpg',
      description: 'Trade, build and settle in this classic strategy game.',
      categorySlug: 'board-game',
      minPlayers: 3,
      maxPlayers: 4,
      moodTags: ['competitive', 'strategic'],
      bulletPoints: [
        'Players trade resources to build settlements',
        'Great for 3-4 players',
        'Engages strategic thinking and negotiation'
      ]
    },
    {
      name: 'Overcooked 2',
      value: 2500,
      imageUrl: 'https://example.com/images/overcooked2.jpg',
      description: 'Chaos in the kitchen! A hilarious co-op cooking game.',
      categorySlug: 'video-game',
      moodTags: ['funny', 'cooperative'],
      bulletPoints: [
        'Cooperative gameplay with friends',
        'Time-management and teamwork challenges',
        'Multiple chaotic kitchen scenarios'
      ]
    },
    {
      name: 'The Lord of the Rings',
      value: 1500,
      imageUrl: 'https://example.com/images/lotr.jpg',
      description: 'The epic fantasy novel that started it all.',
      categorySlug: 'book',
      moodTags: ['epic', 'adventure'],
      bulletPoints: [
        'Classic epic fantasy novel',
        'Rich world-building and characters',
        'Perfect for adventure lovers'
      ]
    },
    {
      name: 'Inception',
      value: 1200,
      imageUrl: 'https://example.com/images/inception.jpg',
      description: 'A mind-bending thriller by Christopher Nolan.',
      categorySlug: 'film',
      moodTags: ['sci-fi', 'thriller'],
      bulletPoints: [
        'Complex plot with multiple dream layers',
        'Directed by Christopher Nolan',
        'Thrilling and thought-provoking'
      ]
    },
    {
      name: 'Popcorn',
      value: 500,
      imageUrl: 'https://example.com/images/popcorn.jpg',
      description: 'Perfect buttery popcorn for movie night.',
      categorySlug: 'snack',
      moodTags: [],
      bulletPoints: [
        'Freshly popped and buttery',
        'Ideal movie night snack',
        'Gluten-free'
      ]
    },
    {
      name: 'Cola',
      value: 300,
      imageUrl: 'https://example.com/images/cola.jpg',
      description: 'Refreshing soft drink to enjoy with snacks.',
      categorySlug: 'drink',
      moodTags: [],
      bulletPoints: [
        'Classic carbonated soft drink',
        'Pairs well with snacks',
        'Contains caffeine'
      ]
    }
  ];

  const createdProducts = [];

  for (const product of rawProducts) {
    const created = await prisma.product.create({
      data: {
        id: uuidv4(),
        name: product.name,
        value: product.value,
        imageUrl: product.imageUrl,
        description: product.description,
        minPlayers: product.minPlayers || null,
        maxPlayers: product.maxPlayers || null,
        moodTags: product.moodTags,
        categoryId: categoryMap[product.categorySlug],
        bulletPoints: product.bulletPoints || []
      }
    });
    createdProducts.push(created);
  }

  // Step 4: Seed example orders
  const statuses = ['requested', 'scheduled', 'delivered'];
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (let i = 0; i < 10; i++) {
    const product = createdProducts[i % createdProducts.length];
    await prisma.order.create({
      data: {
        id: uuidv4(),
        productId: product.id,
        variant: null,
        createdAt: now,
        deliveryDate: tomorrow,
        status: statuses[i % statuses.length]
      }
    });
  }

  console.log('🌱 Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });