const { PrismaClient } = require('@prisma/client');
const { v4: uuid } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { slug: 'board-game', name: 'Board Game' },
    { slug: 'video-game', name: 'Video Game' },
    { slug: 'book', name: 'Book' },
    { slug: 'film', name: 'Film' },
    { slug: 'popcorn', name: 'Popcorn' },
    { slug: 'drinks', name: 'Drinks' }
  ];

  for (const category of categories) {
    await prisma.productCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        id: uuid(),
        slug: category.slug,
        name: category.name
      }
    });
  }

  const getCategoryId = async (slug) => {
    const cat = await prisma.productCategory.findUnique({ where: { slug } });
    return cat.id;
  };

  const entertainmentProducts = [
    {
      name: 'Catan',
      description: 'A popular strategy board game about trading and building settlements.',
      image: '/images/products/catan.jpg',
      categorySlug: 'board-game'
    },
    {
      name: 'Monopoly',
      description: 'The classic real estate board game.',
      image: '/images/products/monopoly.jpg',
      categorySlug: 'board-game'
    },
    {
      name: 'The Legend of Zelda: Breath of the Wild',
      description: 'Explore a vast open world in this Nintendo adventure.',
      image: '/images/products/zelda.jpg',
      categorySlug: 'video-game'
    },
    {
      name: 'God of War Ragnarok',
      description: 'Epic action and storytelling in Norse mythology.',
      image: '/images/products/godofwar.jpg',
      categorySlug: 'video-game'
    },
    {
      name: '1984 by George Orwell',
      description: 'A dystopian novel about surveillance and totalitarianism.',
      image: '/images/products/1984.jpg',
      categorySlug: 'book'
    },
    {
      name: 'The Lord of the Rings',
      description: 'An epic fantasy trilogy set in Middle-earth.',
      image: '/images/products/lotr.jpg',
      categorySlug: 'film'
    }
  ];

  const consumableProducts = [
    {
      name: 'Butter Popcorn',
      description: 'Classic buttery popcorn, perfect for movie nights.',
      image: '/images/products/popcorn.jpg',
      categorySlug: 'popcorn'
    },
    {
      name: 'Coca-Cola',
      description: 'Chilled soft drink to go with your entertainment.',
      image: '/images/products/coke.jpg',
      categorySlug: 'drinks'
    },
    {
      name: 'Sparkling Water',
      description: 'Refreshing and sugar-free drink option.',
      image: '/images/products/sparkling.jpg',
      categorySlug: 'drinks'
    }
  ];

  const createProducts = async (products, type) => {
    for (const product of products) {
      const categoryId = await getCategoryId(product.categorySlug);
      await prisma.product.upsert({
        where: { name: product.name },
        update: {},
        create: {
          id: uuid(),
          name: product.name,
          description: product.description,
          image: product.image,
          type,
          categoryId
        }
      });
    }
  };

  await createProducts(entertainmentProducts, 'ENTERTAINMENT');
  await createProducts(consumableProducts, 'CONSUMABLE');

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });