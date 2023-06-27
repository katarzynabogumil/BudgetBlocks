import { Prisma } from '@prisma/client';

export type ExpenseInclCategory = Prisma.ExpenseGetPayload<{
  include: {
    category: true,
  }
}>