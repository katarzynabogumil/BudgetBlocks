import { prismaMock } from './singleton'
import { saveUserToDb, getUserFromDB } from '../models/users';
import { mockdata } from './mocks';

describe.only('Database unit tests - user:', () => {

  describe('saveUser:', () => {
    test('should create new user with valid data', async () => {
      const data = { ...mockdata.user, id: 1, createdAt: new Date() };
      prismaMock.user.create.mockResolvedValue(data);
      await expect(saveUserToDb(data)).resolves.toEqual(data);
    });

    describe('getUser:', () => {
      test('should get user from the db', async () => {
        const data = { ...mockdata.user, id: 1, createdAt: new Date() };
        prismaMock.user.findUnique.mockResolvedValue(data);
        await expect(getUserFromDB(data.sub)).resolves.toEqual(data);
      });
    });

  });
});