import { hashPassword } from '../src/utils/crypto';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.order.deleteMany()
  await prisma.dishSnapshot.deleteMany()
  await prisma.dish.deleteMany()
  await prisma.category.deleteMany()
  await prisma.guest.deleteMany()
  await prisma.table.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.socket.deleteMany()
  await prisma.account.deleteMany()

  // Create owner account
  const owner = await prisma.account.create({
    data: {
      name: 'Owner',
      email: 'owner@example.com',
      password: await hashPassword('123456'),
      role: 'Owner',
      avatar: 'owner-avatar.jpg'
    }
  })

  // Create employee accounts
  const employee1 = await prisma.account.create({
    data: {
      name: 'Employee 1',
      email: 'employee1@example.com',
      password: await hashPassword('123456'),
      role: 'Employee',
      avatar: 'employee1-avatar.jpg',
      ownerId: owner.id
    }
  })

  const employee2 = await prisma.account.create({
    data: {
      name: 'Employee 2',
      email: 'employee2@example.com',
      password: await hashPassword('123456'),
      role: 'Employee',
      avatar: 'employee2-avatar.jpg',
      ownerId: owner.id
    }
  })

  // Create categories
  const rice = await prisma.category.create({
    data: {
      name: 'Rice',
      description: 'All rice-based dishes',
    },
  })

  const noodles = await prisma.category.create({
    data: {
      name: 'Noodles',
      description: 'All noodle-based dishes',
    },
  })

  const drinks = await prisma.category.create({
    data: {
      name: 'Drinks',
      description: 'Beverages and soft drinks',
    },
  })

  const desserts = await prisma.category.create({
    data: {
      name: 'Desserts',
      description: 'Sweet treats and desserts',
    },
  })

  // Create dishes
  const brokenRice = await prisma.dish.create({
    data: {
      name: 'Broken Rice',
      price: 45000,
      description: 'Traditional Vietnamese broken rice with grilled pork',
      image: 'broken-rice.jpg',
      status: 'Available',
      categoryId: rice.id,
    },
  })

  const chickenRice = await prisma.dish.create({
    data: {
      name: 'Chicken Rice',
      price: 50000,
      description: 'Steamed chicken with fragrant rice',
      image: 'chicken-rice.jpg',
      status: 'Available',
      categoryId: rice.id,
    },
  })

  const pho = await prisma.dish.create({
    data: {
      name: 'Pho',
      price: 40000,
      description: 'Vietnamese noodle soup with beef',
      image: 'pho.jpg',
      status: 'Available',
      categoryId: noodles.id,
    },
  })

  const icedTea = await prisma.dish.create({
    data: {
      name: 'Iced Tea',
      price: 10000,
      description: 'Refreshing iced tea',
      image: 'iced-tea.jpg',
      status: 'Available',
      categoryId: drinks.id,
    },
  })

  const che = await prisma.dish.create({
    data: {
      name: 'Che',
      price: 15000,
      description: 'Sweet Vietnamese dessert soup',
      image: 'che.jpg',
      status: 'Available',
      categoryId: desserts.id,
    },
  })

  // Create tables
  const table1 = await prisma.table.create({
    data: {
      number: 1,
      capacity: 4,
      status: 'Available',
      token: 'table1-token',
    },
  })

  const table2 = await prisma.table.create({
    data: {
      number: 2,
      capacity: 6,
      status: 'Available',
      token: 'table2-token',
    },
  })

  const table3 = await prisma.table.create({
    data: {
      number: 3,
      capacity: 2,
      status: 'Available',
      token: 'table3-token',
    },
  })

  // Create guests
  const guest1 = await prisma.guest.create({
    data: {
      name: 'Guest 1',
      tableNumber: table1.number,
    },
  })

  const guest2 = await prisma.guest.create({
    data: {
      name: 'Guest 2',
      tableNumber: table2.number,
    },
  })

  // Create dish snapshots and orders
  const brokenRiceSnapshot = await prisma.dishSnapshot.create({
    data: {
      name: brokenRice.name,
      price: brokenRice.price,
      description: brokenRice.description,
      image: brokenRice.image,
      status: brokenRice.status,
      dishId: brokenRice.id,
    },
  })

  const phoSnapshot = await prisma.dishSnapshot.create({
    data: {
      name: pho.name,
      price: pho.price,
      description: pho.description,
      image: pho.image,
      status: pho.status,
      dishId: pho.id,
    },
  })

  // Create orders
  await prisma.order.create({
    data: {
      guestId: guest1.id,
      tableNumber: table1.number,
      dishSnapshotId: brokenRiceSnapshot.id,
      quantity: 2,
      orderHandlerId: employee1.id,
      status: 'Paid',
    },
  })

  await prisma.order.create({
    data: {
      guestId: guest2.id,
      tableNumber: table2.number,
      dishSnapshotId: phoSnapshot.id,
      quantity: 1,
      orderHandlerId: employee2.id,
      status: 'Pending',
    },
  })

  // Create refresh tokens
  await prisma.refreshToken.create({
    data: {
      token: 'owner-refresh-token',
      accountId: owner.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  })

  await prisma.refreshToken.create({
    data: {
      token: 'employee1-refresh-token',
      accountId: employee1.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  // Create sockets
  await prisma.socket.create({
    data: {
      socketId: 'owner-socket',
      accountId: owner.id,
    },
  })

  await prisma.socket.create({
    data: {
      socketId: 'guest1-socket',
      guestId: guest1.id,
    },
  })
}

main()
  .then(() => {
    console.log('Seeding finished.')
    return prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })