import prisma from './prisma';
import { Prisma, User } from '@prisma/client'

async function saveUserToDb(data: Prisma.UserCreateInput): Promise<User | undefined> {
  try {
    if (!data.sub) throw new Error('Argument sub is missing.')
    const newUser = await prisma.user.create({
      data: {
        ...data,
        createdAt: new Date(),
      }
    });
    return newUser;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('Error:', e);
      throw new Error('There is a unique constraint violation.');
    } else {
      throw e;
    }
  }
}

async function getUserFromDB(userSub: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      sub: userSub,
    },
  });
  return user;
}

export {
  saveUserToDb,
  getUserFromDB,
};
