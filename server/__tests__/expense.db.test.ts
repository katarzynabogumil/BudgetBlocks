import prisma from '../models/prisma';
import { User, Project, Expense, Prisma, ExpCategory } from '@prisma/client';
import { mockdata } from './mocks';

import {
  getExpenseFromDB,
  saveExpenseToDb,
  updateExpenseinDb,
  deleteExpenseFromDB,
  addUserVoteToDb,
} from '../models/expenses';

describe('Database integration tests - expense:', () => {
  let user: User;
  let project: Project;
  let category: ExpCategory;
  let expense: Expense;

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.expense.deleteMany();

    user = await prisma.user.create({ data: mockdata.user });
    project = await prisma.project.create({
      data: {
        ...mockdata.project,
        owners: {
          connect: { id: user.id }
        },
        invitedUsers: {
          connect: { id: user.id }
        }
      },
    });
    category = await prisma.expCategory.create({
      data: {
        ...mockdata.category,
        project: {
          connect: { id: project.id }
        },
      },
    });
    expense = await prisma.expense.create({
      data: {
        ...mockdata.expense,
        project: {
          connect: { id: project.id }
        },
        category: {
          connect: { id: category.id }
        },
      },
    });
  })

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.expCategory.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.$disconnect();
  });


  describe('getExpenseFromDB:', () => {

    test('should get expense from db with valid data', async () => {
      const foundExp = await getExpenseFromDB(expense.id);
      expect(foundExp).toHaveProperty('id');
      expect(foundExp).toHaveProperty('name', expense.name);
    });

    test('should not get expense from db with invalid data', async () => {
      const foundExp = await getExpenseFromDB(-1);
      expect(foundExp).toEqual(null);
    });

    test('should not get expense from db if not saved yet', async () => {
      await prisma.expense.deleteMany();
      const foundExp = await getExpenseFromDB(expense.id);
      expect(foundExp).toEqual(null);
    });
  });


  describe('saveExpenseToDb:', () => {
    test('should create new category with valid data', async () => {
      const data = { ...mockdata.expense, category, project: project as Prisma.ExpenseCreateNestedOneWithoutCommentsInput };
      const createdExp = await saveExpenseToDb(project.id, data as Prisma.ExpenseCreateInput);
      expect(createdExp).toHaveProperty('id');
      expect(createdExp).toHaveProperty('name', expense.name);
    });

    test('should not create new category with missing input', async () => {
      const { name: _, ...invalidData } = mockdata.expense;
      const wrapper = async () => {
        try {
          await saveExpenseToDb(project.id, invalidData as Prisma.ExpenseCreateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });

    test('should not create new category with duplicate id', async () => {
      const data = { id: expense.id, ...mockdata.expense, category, project: project as Prisma.ExpenseCreateNestedOneWithoutCommentsInput };
      const wrapper = async () => {
        try {
          await saveExpenseToDb(project.id, data as Prisma.ExpenseCreateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('updateExpenseinDb:', () => {
    test('should update expense with valid data', async () => {
      const data = { ...mockdata.expense, category };
      const updatedExp = await updateExpenseinDb(project.id, expense.id, data as Prisma.ExpenseUpdateInput);
      expect(updatedExp).toHaveProperty('id');
      expect(updatedExp).toHaveProperty('name', expense.name);
    });

    test('should not update expense with invalid data', async () => {
      const { name: _, ...invalidData } = mockdata.expense;
      const wrapper = async () => {
        try {
          await updateExpenseinDb(project.id, expense.id, invalidData as Prisma.ExpenseUpdateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });

    test('should not update expense if not saved yet', async () => {
      await prisma.expense.deleteMany();
      const data = { id: expense.id, ...mockdata.expense, category };
      const wrapper = async () => {
        try {
          await updateExpenseinDb(project.id, expense.id, data as Prisma.ExpenseUpdateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('deleteExpenseFromDB:', () => {

    test('should delete expense with valid data', async () => {
      const deletedExp = await deleteExpenseFromDB(project.id, expense.id);
      expect(deletedExp).toHaveProperty('id', expense.id);
    });

    test('should not delete expense if expense not saved yet', async () => {
      await prisma.expense.deleteMany();
      const wrapper = async () => {
        try {
          await deleteExpenseFromDB(project.id, expense.id);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('addUserVoteToDb:', () => {

    test('should add vote to expense with valid data', async () => {
      const updatedExp = await addUserVoteToDb('up', user.sub, expense.id);
      expect(updatedExp).toHaveProperty('id');
      expect(updatedExp).toHaveProperty('upvotes', [user.sub]);
    });

    test('should not add vote to expense with no direction', async () => {
      const updatedExp = await addUserVoteToDb('', user.sub, expense.id);
      expect(updatedExp).toHaveProperty('id');
      expect(updatedExp).toHaveProperty('upvotes', []);
    });

    test('should not add vote to expense with invalid data', async () => {
      const wrapper = async () => {
        try {
          await addUserVoteToDb('up', user.sub, -1);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });

    test('should not add vote to expense if not saved yet', async () => {
      await prisma.expense.deleteMany();
      const wrapper = async () => {
        try {
          await addUserVoteToDb('up', user.sub, expense.id)
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });
});