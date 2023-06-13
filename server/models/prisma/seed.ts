import { PrismaClient } from '@prisma/client';
import { mockdata } from './mockdata';
import { saveUserToDb } from '../users';
import { saveProjectToDb } from '../projects';
import { saveExpenseToDb, saveCategoryToDb } from '../expenses';
import { saveCommentToDb } from '../comments';

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
  }, 10000);

  // otherwise transaction errors (added records not yet found)
  setTimeout(() => {
    mockdata.categories.forEach(async (el) => {
      let [id, category] = el;
      await saveCategoryToDb(id, category);
    });
  }, 40000);

  // otherwise transaction errors (added records not yet found)
  setTimeout(() => {
    mockdata.expenses.forEach(async (el) => {
      let [id, expense] = el;
      setTimeout(async () => {
        await saveExpenseToDb(id, expense);
      }, 50000)
    });
  }, 20000);

  // mockdata.comments.forEach(async (el) => {
  //   let [expenseId, userId, data] = el;
  //   await saveCommentToDb(expenseId, userId, data);
  // });
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