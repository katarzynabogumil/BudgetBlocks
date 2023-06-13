// @ts-nocheck 
'use strict';

import { PrismaClient } from '@prisma/client';
import { mockdata } from './mockdata';

const prisma = new PrismaClient();

async function main() {

  await prisma.$transaction([
    prisma.user.upsert({
      where: { id: 1 },
      update: {},
      create: mockdata.users[0]
    }),
    prisma.user.upsert({
      where: { id: 2 },
      update: {},
      create: mockdata.users[1]
    }),
    prisma.user.upsert({
      where: { id: 3 },
      update: {},
      create: mockdata.users[2]
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })