import prisma from "./prisma";
import { User } from '../interfaces/user';

async function saveUserToDb (data: User) {
  data.createdAt = new Date().toISOString();
  const newUser = await prisma.user.create({ data });
  return newUser;
}; 

async function getUserFromDB (userSub: string) {
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
