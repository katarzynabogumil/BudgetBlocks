import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed(data: seedData): Promise<null> {
  await findAndDeleteUser(data.user.sub);
  if (data.user.sub) {
    const user = await prisma.user.create({ data: data.user });

    if (data.project) {
      const project = await prisma.project.create({
        data: {
          ...data.project,
          owners: {
            connect: { id: user.id }
          },
        },
      });
      const category = await prisma.expCategory.create({
        data: {
          ...data.category,
          project: {
            connect: { id: project.id }
          },
        },
      });
      const expense = await prisma.expense.create({
        data: {
          ...data.expenses[0],
          project: {
            connect: { id: project.id }
          },
          category: {
            connect: { id: category.id }
          },
        },
      });
      await prisma.comment.create({
        data: {
          ...data.comment,
          expense: {
            connect: { id: expense.id }
          },
          user: {
            connect: { id: user.id }
          },
        },
      });

      data.expenses.forEach(async (exp, i) => {
        if (i !== 0) {
          await prisma.expense.create({
            data: {
              ...exp,
              project: {
                connect: { id: project.id }
              },
              category: {
                connect: { id: category.id }
              },
            },
          });
        }
      });
    }
  }

  await prisma.$disconnect();
  return null;
}

async function teardown(sub: string): Promise<null> {
  await findAndDeleteUser(sub);
  await prisma.$disconnect();
  return null;
}

async function findAndDeleteUser(sub: string): Promise<void> {
  const foundUser = await prisma.user.findUnique({ where: { sub } });
  if (foundUser) await prisma.user.delete({ where: { sub } });
}

type UserModel = Prisma.UserCreateInput;
type ProjectModel = Prisma.ProjectCreateInput;
type ExpenseModel = Prisma.ExpenseCreateInput;
type ExpCategoryModel = Prisma.ExpCategoryCreateInput;
type CommentModel = Prisma.CommentCreateInput;

type seedData = {
  user: UserModel,
  project: ProjectModel,
  expenses: ExpenseModel[],
  category: ExpCategoryModel,
  comment: CommentModel
}

export {
  seed,
  teardown,
  seedData,
};
