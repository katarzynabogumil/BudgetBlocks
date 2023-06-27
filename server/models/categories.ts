import { Prisma } from "@prisma/client";
import prisma from "./prisma";

async function updateCatOrderIdinDb(categoryId: number, orderId: number) {
  const category = await prisma.expCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      orderId,
    },
  });
  return category;
};

async function updateCatOptionalinDb(categoryId: number, optional: boolean) {
  const category = await prisma.expCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      optional,
    },
  });
  return category;
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
}


export {
  updateCatOrderIdinDb,
  updateCatOptionalinDb,
  getCategoryFromDb,
  saveCategoryToDb,
  deleteCategoryFromDb
}
