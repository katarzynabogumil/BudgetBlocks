import prisma from "./prisma";
import { ExpCategory, Expense, Prisma } from '@prisma/client'
import {
  getCategoryFromDb,
  saveCategoryToDb,
  deleteCategoryFromDb,
  updateCatOptionalinDb,
} from './categories';

type ExpCategoryInclExpenses = null | ExpCategory | (ExpCategory & {
  expenses: Expense[];
})

async function saveExpenseToDb(projectId: number, data: Prisma.ExpenseCreateInput) {
  const categoryData = data.category as Prisma.ExpCategoryCreateInput;
  let { category: _, ...expenseData } = data;

  let category: ExpCategoryInclExpenses = await getCategoryFromDb(projectId, categoryData.category);
  if (!category) category = await saveCategoryToDb(projectId, categoryData);

  const newExpense = await prisma.expense.create({
    data: {
      ...expenseData as Prisma.ExpenseCreateInput,
      createdAt: new Date(),
      project: {
        connect: { id: projectId }
      },
      category: {
        connect: { id: category.id }
      },
    },
    include: {
      category: true,
    }
  });
  return newExpense;
};

async function updateExpenseinDb(projectId: number, expenseId: number, data: Prisma.ExpenseUpdateInput) {
  const categoryData = data.category as Prisma.ExpCategoryCreateInput;
  let { category: _, ...expenseData } = data;

  let category: ExpCategoryInclExpenses = await getCategoryFromDb(projectId, categoryData.category);
  if (!category) category = await saveCategoryToDb(projectId, categoryData);
  else if (category.optional !== categoryData.optional) category = await updateCatOptionalinDb(category.id, categoryData.optional || false);

  const expense = await prisma.expense.update({
    where: {
      id: expenseId,
    },
    data: {
      ...data,
      updatedAt: new Date(),
      category: {
        connect: { id: category.id }
      },
    },
    include: {
      category: {
        include: {
          expenses: true,
        }
      }
    }
  });
  return expense;
};

// async function getExpensesFromDB (projectId: number) {
//   const expenses = await prisma.expense.findMany({
//     where: {
//       projectId: projectId
//     },
//     include: {
//       comments: true,
//     },
//   });
//   return expenses;
// }; 

async function getExpenseFromDB(id: number) {
  const expense = await prisma.expense.findUnique({
    where: {
      id
    },
    include: {
      category: true
    }
  });
  return expense;
};

async function deleteExpenseFromDB(projectId: number, expenseId: number) {
  const expense = await prisma.expense.delete({
    where: {
      id: expenseId
    },
    include: {
      category: true
    }
  });

  let category = await getCategoryFromDb(projectId, expense.category.category);
  if (!category?.expenses.length) deleteCategoryFromDb(expense.category.id);

  return expense;
};


async function addUserVoteToDb(direction: string, userSub: string, expenseId: number) {
  const expense = await prisma.expense.findUnique({
    where: {
      id: expenseId,
    }
  });

  let upvotes: string[] = expense?.upvotes || [];
  let downvotes: string[] = expense?.downvotes || [];

  if (direction === 'up') {
    if (expense?.upvotes?.includes(userSub)) {
      upvotes = upvotes.filter(sub => sub !== userSub);
    } else {
      upvotes = [...upvotes, userSub];
      downvotes = downvotes.filter(sub => sub !== userSub);
    }
  } else if (direction === 'down') {
    if (expense?.downvotes?.includes(userSub)) {
      downvotes = downvotes.filter(sub => sub !== userSub);
    } else {
      downvotes = [...downvotes, userSub];
      upvotes = upvotes.filter(sub => sub !== userSub);
    }
  }

  const updatedExp = await prisma.expense.update({
    where: {
      id: expenseId,
    },
    data: {
      upvotes: upvotes,
      downvotes: downvotes,
    },
    include: {
      category: true,
    }
  });
  return updatedExp;
}


export {
  saveExpenseToDb,
  updateExpenseinDb,
  getExpenseFromDB,
  // getExpensesFromDB,
  deleteExpenseFromDB,
  saveCategoryToDb,
  addUserVoteToDb,
}
