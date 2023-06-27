import prisma from "./prisma";

async function updateCategoryinDb(categoryId: number, orderId: number) {
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


export {
  updateCategoryinDb
}
