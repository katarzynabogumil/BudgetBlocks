import prisma from "./prisma";
import { Prisma } from '@prisma/client'

async function saveExpenseToDb (projectId: number, expenseData: Prisma.ExpenseCreateInput) {
  const newExpense = await prisma.expense.create({ 
    data: {
      ...expenseData,
      createdAt: new Date().toISOString(),
      project: {
        connect: {id: projectId}
      }
    }
  });
  
  return newExpense;
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
