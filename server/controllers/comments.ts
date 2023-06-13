import express from 'express';
import { Prisma } from '@prisma/client'

import {
  getCommentsFromDB,
  saveCommentToDb,
  deleteCommentFromDB,
} from '../models/comments';
import { getUserFromDB } from '../models/users';

async function getAllComments(req: express.Request, res: express.Response) {
  try {
    const projectId = Number(req.params.projectId);
    const comments = await getCommentsFromDB(projectId);
    res.status(200);
    res.send(comments);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};

async function saveComment(req: express.Request<{ expenseId: string }, {}, Prisma.CommentCreateInput>, res: express.Response) {
  try {
    const expenseId = Number(req.params.expenseId);
    const data = req.body;

    const userSub = req.auth?.payload.sub || '';
    const user = await getUserFromDB(userSub);
    const userId = user?.id || 0;

    const newComment = await saveCommentToDb(expenseId, userId, data);

    res.status(201);
    res.send(newComment);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};

async function deleteComment(req: express.Request, res: express.Response) {
  try {
    const id = Number(req.params.commentId);
    const comment = await deleteCommentFromDB(id);
    res.status(200);
    res.send(comment);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};

export {
  getAllComments,
  saveComment,
  deleteComment,
};
