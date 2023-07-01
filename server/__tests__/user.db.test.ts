import prisma from '../models/prisma';
import { Prisma } from '@prisma/client';
import { mockdata } from './mocks';
import { saveUserToDb, getUserFromDB } from '../models/users';

describe('Database integration tests - user:', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  })

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('saveUserToDb:', () => {
    test('should create new user with valid data', async () => {
      const data = mockdata.user;
      const createdUser = await saveUserToDb(data);
      expect(createdUser).toHaveProperty('id');
      expect(createdUser).toHaveProperty('sub', data.sub);
    });

    test('should not create new user with not unique sub', async () => {
      const data = mockdata.user;
      await saveUserToDb(data);
      const wrapper = async () => {
        try {
          await saveUserToDb(data);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });

    test('should not create new user with missing input', async () => {
      const { sub: _, ...invalidData } = mockdata.user;
      const wrapper = async () => {
        try {
          await saveUserToDb(invalidData as Prisma.UserCreateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('getUserFromDB:', () => {

    test('should get user from db with valid data', async () => {
      await prisma.user.create({ data: mockdata.user });
      const data = mockdata.user;
      const foundUser = await prisma.user.findUnique({
        where: {
          sub: data.sub,
        },
      });
      await expect(getUserFromDB(data.sub)).resolves.toEqual(foundUser);
    });

    test('should not get user from db with invalid data', async () => {
      await prisma.user.create({ data: mockdata.user });
      await expect(getUserFromDB('')).resolves.toEqual(null);
    });

    test('should not get user from db if not saved yet', async () => {
      const data = mockdata.user;
      await expect(getUserFromDB(data.sub)).resolves.toEqual(null);
    });
  });
});