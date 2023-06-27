import { Prisma } from '@prisma/client';

export type ExpCategoryInclExpenses = Prisma.ExpCategoryGetPayload<{
  include: { expenses: true }
}>