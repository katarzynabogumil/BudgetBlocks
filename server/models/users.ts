import prisma from "./prisma";
import { Prisma } from '@prisma/client'

async function saveUserToDb(data: Prisma.UserCreateInput) {
  const newUser = await prisma.user.create({
    data: {
      ...data,
      createdAt: new Date(),
    }
  });
  return newUser;
};

async function getUserFromDB(userSub: string) {
  const user = await prisma.user.findUnique({
    where: {
      sub: userSub
    },
  });
  return user;
};

export {
  saveUserToDb,
  getUserFromDB,
};
