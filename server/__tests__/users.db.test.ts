import prisma from '../models/prisma';
import { mockdata } from './mocks';
import { saveUserToDb, getUserFromDB } from '../models/users';

describe('Database integration tests - user:', () => {
  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  })

  describe('saveUserToDb:', () => {
    test('should create new user with valid data', async () => {
      const data = mockdata.user;
      const createdUser = await saveUserToDb(data);
      expect(createdUser).toHaveProperty('id');
    });
  });

  describe('getUserFromDB:', () => {
    beforeAll(async () => {
      await prisma.user.create({ data: mockdata.user });
    });

    test('should get user from db with valid data', async () => {
      const data = mockdata.user;
      const foundUser = await prisma.user.findUnique({
        where: {
          sub: data.sub,
        },
      });
      await expect(getUserFromDB(data.sub)).resolves.toEqual(foundUser);
    });
  });
});