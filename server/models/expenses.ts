import prisma from "./prisma";
import { ExpCategory, Expense, Prisma } from '@prisma/client'

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
//       upvotes: true,
//       downvotes: true,
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

async function getCategoryFromDb(projectId: number, category: string) {
  const foundCategory = await prisma.expCategory.findFirst({
    where: {
      category,
      projectId,
    },
    include: {
      expenses: true,
    }
  });
  return foundCategory;
};

async function saveCategoryToDb(projectId: number, data: Prisma.ExpCategoryCreateInput) {
  const newCategory = await prisma.expCategory.create({
    data: {
      ...data,
      project: {
        connect: { id: projectId }
      },
    }
  });
  return newCategory;
};

async function deleteCategoryFromDb(id: number) {
  const category = await prisma.expCategory.delete({
    where: {
      id
    },
  });
  return category;
};


export {
  saveExpenseToDb,
  updateExpenseinDb,
  getExpenseFromDB,
  // getExpensesFromDB,
  deleteExpenseFromDB,
};
