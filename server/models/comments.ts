import prisma from "./prisma";
import { Prisma } from '@prisma/client'
import { CommentDictModel } from "../interfaces/comment.model";

async function getCommentsFromDB(projectId: number) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
    include: {
      expenses: {
        include: {
          comments: {
            include: {
              user: true
            }
          }
        }
      }
    }
  });

  let commentDict: CommentDictModel = {};
  project?.expenses.forEach((exp) => {
    commentDict[exp.id] = exp.comments;
  });
  return commentDict;
};

async function saveCommentToDb(expenseId: number, userId: number, data: Prisma.CommentCreateInput) {
  const newComment = await prisma.comment.create({
    data: {
      text: data.text,
      createdAt: new Date(),
      expense: {
        connect: { id: expenseId }
      },
      user: {
        connect: { id: userId }
      },
    },
    include: {
      user: true
    }
  });

  return newComment;
};

async function deleteCommentFromDB(commentId: number) {
  const comment = await prisma.comment.delete({
    where: {
      id: commentId
    },
  });
  return comment;
};

export {
  getCommentsFromDB,
  saveCommentToDb,
  deleteCommentFromDB,
};
