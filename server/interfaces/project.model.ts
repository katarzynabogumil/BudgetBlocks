import { Prisma } from '@prisma/client';

export type ProjectInclOwners = Prisma.ProjectGetPayload<{
  include: {
    owners: true,
    invitedUsers: true,
  },
}>

export type ProjectInclExpenses = Prisma.ProjectGetPayload<{
  include: {
    owners: true,
    invitedUsers: true,
    expenses: {
      include: {
        category: {
          include: {
            expenses: true,
          }
        }
      }
    },
    categories: {
      include: {
        expenses: {
          include: {
            comments: true,
            category: true,
          }
        },
      }
    },
  },
}>

const projectPublic = {
  name: true,
  type: true,
  budget: true,
  currency: true,
  dateFrom: true,
  dateTo: true,
  area: true,
  location: true,
  noOfGuests: true,
  occasion: true,
  destination: true,
  description: true,
  categories: {
    select: {
      category: true,
    }
  },
} satisfies Prisma.ProjectSelect;

export type ProjectPublic = Prisma.ProjectGetPayload<{ select: typeof projectPublic }>;
