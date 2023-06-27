import prisma from './prisma';
import { Prisma } from '@prisma/client'
import { CommentModel, CommentDictModel } from '../interfaces/comment.model';

async function getCommentsFromDB(projectId: number): Promise<CommentDictModel> {
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

  const commentDict: CommentDictModel = {};
  project?.expenses.forEach((exp) => {
    commentDict[exp.id] = exp.comments;
  });
  return commentDict;
}

async function saveCommentToDb
  (
    expenseId: number,
    userId: number,
    data: Prisma.CommentCreateInput
  ): Promise<CommentModel> {
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
}

async function deleteCommentFromDB(commentId: number): Promise<CommentModel> {
  const comment = await prisma.comment.delete({
    where: {
      id: commentId
    },
    include: {
      user: true
    }
  });
  return comment;
}

export {
  getCommentsFromDB,
  saveCommentToDb,
  deleteCommentFromDB,
};
