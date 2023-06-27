import prisma from './prisma';
import { ExpCategory, Prisma } from '@prisma/client';
import { ExpCategoryInclExpenses } from '../interfaces/expCategory.model';

async function updateCatOrderIdinDb(categoryId: number, orderId: number): Promise<ExpCategoryInclExpenses> {
  const category = await prisma.expCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      orderId,
    },
    include: {
      expenses: true,
    }
  });
  return category;
}

async function updateCatOptionalinDb(categoryId: number, optional: boolean): Promise<ExpCategoryInclExpenses> {
  const category = await prisma.expCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      optional,
    },
    include: {
      expenses: true,
    }
  });
  return category;
}

async function getCategoryFromDb
  (
    projectId: number,
    category: string
  ): Promise<ExpCategoryInclExpenses | null> {
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
}

async function saveCategoryToDb(projectId: number, data: Prisma.ExpCategoryCreateInput): Promise<ExpCategoryInclExpenses> {
  const newCategory = await prisma.expCategory.create({
    data: {
      ...data,
      project: {
        connect: { id: projectId }
      },
    },
    include: {
      expenses: true,
    }
  });
  return newCategory;
}

async function deleteCategoryFromDb(id: number): Promise<ExpCategory> {
  const category = await prisma.expCategory.delete({
    where: {
      id
    },
  });
  return category;
}


export {
  updateCatOrderIdinDb,
  updateCatOptionalinDb,
  getCategoryFromDb,
  saveCategoryToDb,
  deleteCategoryFromDb
}
