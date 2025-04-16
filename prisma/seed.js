
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.drop.deleteMany();
  await prisma.card.deleteMany();
  await prisma.case.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.achievement.deleteMany();

  const baseCollection = await prisma.collection.create({
    data: { name: 'Base Collection' },
  });

  await prisma.card.createMany({
    data: [
      { name: 'Common Warrior', rarity: 'Обычная', price: 10, imageUrl: '/card1.png', collectionId: baseCollection.id },
      { name: 'Silver Archer', rarity: 'Серебряная', price: 30, imageUrl: '/card2.png', collectionId: baseCollection.id },
      { name: 'Golden Mage', rarity: 'Золотая', price: 100, imageUrl: '/card3.png', collectionId: baseCollection.id },
      { name: 'Diamond Golem', rarity: 'Алмазная', price: 300, imageUrl: '/card4.png', collectionId: baseCollection.id },
      { name: 'Legendary Dragon', rarity: 'Легендарная', price: 1000, imageUrl: '/card5.png', collectionId: baseCollection.id },
    ],
  });

  const cardList = await prisma.card.findMany();

  await prisma.case.create({
    data: {
      name: 'Starter Case',
      price: 200,
      imageUrl: '/case.png',
      cards: {
        connect: cardList.map((card) => ({ id: card.id })),
      },
    },
  });

  await prisma.achievement.createMany({
    data: [
      {
        title: 'Первый дроп',
        description: 'Открой первый кейс',
        icon: '🎁',
        condition: JSON.stringify({ drops: 1 }),
        reward: 100,
      },
      {
        title: 'Коллекционер',
        description: 'Получите 5 карточек',
        icon: '📦',
        condition: JSON.stringify({ inventory: 5 }),
      },
      {
        title: 'Продавец',
        description: 'Продай хоть одну карту',
        icon: '💰',
        condition: JSON.stringify({ sold: 1 }),
      },
    ],
  });

  console.log('✅ Сид выполнен!');
}

main().finally(() => prisma.$disconnect());
