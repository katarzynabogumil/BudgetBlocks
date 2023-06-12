import { PrismaClient } from '@prisma/client';
import { mockdata } from './mockdata';
import { saveUserToDb } from '../users';
import { saveProjectToDb } from '../projects';
import { saveExpenseToDb } from '../expenses';

const prisma = new PrismaClient();

async function main() {
  mockdata.users.forEach(async (el) => {
    await saveUserToDb(el);
  });

  // otherwise transaction errors (added records not yet found)
  setTimeout(() => {
    mockdata.projects.forEach(async (el) => {
      let [sub, project] = el;
      await saveProjectToDb(sub, project);
    });
  }, 1000);

  // TODO save fisrt categories to db

  // otherwise transaction errors (added records not yet found)
  setTimeout(() => {
    mockdata.expenses.forEach(async (el) => {
      let [id, expense] = el;
      setTimeout(async () => {
        await saveExpenseToDb(id, expense);
      }, 10000)
    });
  }, 10000);
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