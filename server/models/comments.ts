import prisma from "./prisma";
import { Prisma } from '@prisma/client'

async function saveCommentToDb (expenseId: number, userId: number, data: Prisma.CommentCreateInput) { 
  const newComment = await prisma.comment.create({ 
    data: {
      text: data.text,
      createdAt: new Date().toISOString(),
      expense: {
        connect: {id: expenseId}
      },
      user: {
        connect: {id: userId}
      },
    }
  });
  
  return newComment;
}; 

async function deleteCommentFromDB (commentId: number) {
  const comment = await prisma.expense.delete({
    where: {
      id: commentId
    },
  });
  return comment;
}; 

export {
  saveCommentToDb,
  deleteCommentFromDB,
};
