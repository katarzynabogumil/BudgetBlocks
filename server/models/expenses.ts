import prisma from "./prisma";
import { Prisma } from '@prisma/client'

async function saveExpenseToDb (projectId: number, data: Prisma.ExpenseCreateInput) {
  const categoryData = data.category as Prisma.ExpCategoryCreateInput;
  let {category: _, ...expenseData} = data;

  let category = await checkIfCategoryInDb(projectId, categoryData);
  if (!category) category = await saveCategoryToDb(projectId, categoryData);

  const newExpense = await prisma.expense.create({ 
    data: {
      ...expenseData as Prisma.ExpenseCreateInput,
      createdAt: new Date().toISOString(),
      project: {
        connect: {id: projectId}
      },
      category: {
        connect: {id: category.id}
      },
    }
  });
  return newExpense;
}; 

async function checkIfCategoryInDb (projectId: number, data: Prisma.ExpCategoryCreateInput) {
  const category = await prisma.expCategory.findFirst({
    where: {
      category: data.category,
      projectId: projectId,
    },
  });
  return category;
}; 

async function saveCategoryToDb (projectId: number, data: Prisma.ExpCategoryCreateInput) {
  const newCategory = await prisma.expCategory.create({ 
    data: {
      ... data,
      project: {
        connect: {id: projectId}
      },
    }
  });
  return newCategory;
}; 

async function updateExpenseinDb (expenseId: number, data: Prisma.ExpenseUpdateInput) {
  const expense = await prisma.expense.update({
    where: {
      id: expenseId,
    },
    data: { 
      ...data,
      updatedAt: new Date().toISOString()
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

async function getExpenseFromDB (id: number) {
  const expense = await prisma.expense.findUnique({
    where: {
      id
    },
  });
  return expense;
}; 

async function deleteExpenseFromDB (expenseId: number) {
  const expense = await prisma.expense.delete({
    where: {
      id: expenseId
    },
  });
  return expense;
}; 

export {
  saveExpenseToDb,
  updateExpenseinDb,
  getExpenseFromDB,
  // getExpensesFromDB,
  deleteExpenseFromDB,
};
