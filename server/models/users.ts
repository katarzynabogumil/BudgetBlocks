import prisma from './prisma';
import { Prisma, User } from '@prisma/client'

async function saveUserToDb(data: Prisma.UserCreateInput): Promise<User | undefined> {
  if (!data.sub || !data.firstName || !data.email) {
    throw new Error('Required fields are missing.')
  }
  const newUser = await prisma.user.create({
    data: {
      ...data,
      createdAt: new Date(),
    }
  });
  return newUser;
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
