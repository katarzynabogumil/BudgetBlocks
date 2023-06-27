import prisma from './prisma';
import { Prisma } from '@prisma/client';
import { ExpCategoryInclExpenses } from '../interfaces/expCategory.model';
import { ExpenseInclCategory } from '../interfaces/expense.model';

import {
  getCategoryFromDb,
  saveCategoryToDb,
  deleteCategoryFromDb,
  updateCatOptionalinDb,
} from './categories';

async function saveExpenseToDb
  (
    projectId: number,
    data: Prisma.ExpenseCreateInput
  ): Promise<ExpenseInclCategory> {
  const categoryData = data.category as Prisma.ExpCategoryCreateInput;
  const { category: _, ...expenseData } = data;

  const category: ExpCategoryInclExpenses = await getCategoryFromDb(projectId, categoryData.category)
    || await saveCategoryToDb(projectId, categoryData);

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
}

async function updateExpenseinDb
  (
    projectId: number,
    expenseId: number,
    data: Prisma.ExpenseUpdateInput
  ): Promise<ExpenseInclCategory> {
  const categoryData = data.category as Prisma.ExpCategoryCreateInput;
  const { category: _, ...expenseData } = data;

  let category: ExpCategoryInclExpenses = await getCategoryFromDb(projectId, categoryData.category)
    || await saveCategoryToDb(projectId, categoryData);
  if (category.optional !== categoryData.optional) {
    category = await updateCatOptionalinDb(category.id, categoryData.optional || false);
  }

  const expense = await prisma.expense.update({
    where: {
      id: expenseId,
    },
    data: {
      ...expenseData,
      updatedAt: new Date(),
      category: {
        connect: { id: category.id }
      },
    },
    include: {
      category: true,
    }
  });
  return expense;
}

async function getExpenseFromDB(id: number): Promise<ExpenseInclCategory | null> {
  const expense = await prisma.expense.findUnique({
    where: {
      id
    },
    include: {
      category: true,
    }
  });
  return expense;
}

async function deleteExpenseFromDB(projectId: number, expenseId: number): Promise<ExpenseInclCategory> {
  const expense = await prisma.expense.delete({
    where: {
      id: expenseId
    },
    include: {
      category: true
    }
  });

  const category = await getCategoryFromDb(projectId, expense.category.category);
  if (!category?.expenses.length) deleteCategoryFromDb(expense.category.id);

  return expense;
}


async function addUserVoteToDb
  (
    direction: string,
    userSub: string,
    expenseId: number
  ): Promise<ExpenseInclCategory> {
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
  deleteExpenseFromDB,
  saveCategoryToDb,
  addUserVoteToDb,
}
