import prisma from '../models/prisma';
import { Prisma, User, Project, ExpCategory } from '@prisma/client';
import { mockdata } from './mocks';

import {
  updateCatOrderIdinDb,
  updateCatOptionalinDb,
  getCategoryFromDb,
  saveCategoryToDb,
  deleteCategoryFromDb
} from '../models/categories';

describe('Database integration tests - project:', () => {
  let user: User;
  let project: Project;
  let category: ExpCategory;

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.expCategory.deleteMany();

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
  })


  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.expCategory.deleteMany();
    await prisma.$disconnect();
  });


  describe('getCategoryFromDb:', () => {

    test('should get category from db with valid data', async () => {
      const foundCategory = await getCategoryFromDb(project.id, category.category);
      expect(foundCategory).toHaveProperty('id');
      expect(foundCategory).toHaveProperty('orderId', category.orderId);
    });

    test('should not get category from db with invalid data', async () => {
      const foundCategory = await getCategoryFromDb(project.id, '');
      expect(foundCategory).toEqual(null);
    });

    test('should not get category from db if not saved yet', async () => {
      await prisma.expCategory.deleteMany();
      const foundCategory = await getCategoryFromDb(project.id, category.category);
      expect(foundCategory).toEqual(null);
    });
  });


  describe('updateCatOrderIdinDb:', () => {
    test('should updated category with valid data', async () => {
      const updatedCat = await updateCatOrderIdinDb(category.id, category.orderId + 1);
      expect(updatedCat).toHaveProperty('id');
      expect(updatedCat).toHaveProperty('orderId', category.orderId + 1);
    });

    test('should not update category if not saved yet', async () => {
      const wrapper = async () => {
        try {
          await updateCatOrderIdinDb(-1, category.orderId + 1);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('updateCatOptionalinDb:', () => {
    test('should updated category with valid data', async () => {
      const updatedCat = await updateCatOptionalinDb(category.id, true);
      expect(updatedCat).toHaveProperty('id');
      expect(updatedCat).toHaveProperty('optional', true);
    });

    test('should not update category if not saved yet', async () => {
      const wrapper = async () => {
        try {
          await updateCatOptionalinDb(-1, true);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('saveCategoryToDb:', () => {
    test('should create new category with valid data', async () => {
      const data = mockdata.category;
      const createdCat = await saveCategoryToDb(project.id, data as Prisma.ExpCategoryCreateInput);
      expect(createdCat).toHaveProperty('id');
      expect(createdCat).toHaveProperty('orderId', category.orderId);
    });

    test('should not create new category with missing input', async () => {
      const { orderId: _, ...invalidData } = mockdata.category;
      const wrapper = async () => {
        try {
          await saveCategoryToDb(project.id, invalidData as Prisma.ExpCategoryCreateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });

    test('should not create new category with duplicate id', async () => {
      const data = { id: category.id, ...mockdata.category, project: project as Prisma.ProjectCreateNestedOneWithoutCategoriesInput };
      const wrapper = async () => {
        try {
          await saveCategoryToDb(project.id, data);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('deleteCategoryFromDb:', () => {

    test('should delete category with valid data', async () => {
      const deletedCat = await deleteCategoryFromDb(category.id);
      expect(deletedCat).toHaveProperty('id', category.id);
    });

    test('should not delete category if category not saved yet', async () => {
      await prisma.expCategory.deleteMany();
      const wrapper = async () => {
        try {
          await deleteCategoryFromDb(category.id);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });
});