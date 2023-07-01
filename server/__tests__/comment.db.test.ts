import prisma from '../models/prisma';
import { User, Project, Expense, Prisma, ExpCategory, Comment } from '@prisma/client';
import { mockdata } from './mocks';

import {
  getCommentsFromDB,
  saveCommentToDb,
  deleteCommentFromDB,
} from '../models/comments';

describe('Database integration tests - expense:', () => {
  let user: User;
  let project: Project;
  let category: ExpCategory;
  let expense: Expense;
  let comment: Comment;

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.comment.deleteMany();

    user = await prisma.user.create({ data: mockdata.user });
    project = await prisma.project.create({
      data: {
        ...mockdata.project,
        owners: {
          connect: { id: user.id }
        },
        invitedUsers: {
          connect: { id: user.id }
        }
      },
    });
    category = await prisma.expCategory.create({
      data: {
        ...mockdata.category,
        project: {
          connect: { id: project.id }
        },
      },
    });
    expense = await prisma.expense.create({
      data: {
        ...mockdata.expense,
        project: {
          connect: { id: project.id }
        },
        category: {
          connect: { id: category.id }
        },
      },
    });
    comment = await prisma.comment.create({
      data: {
        ...mockdata.comment,
        expense: {
          connect: { id: expense.id }
        },
        user: {
          connect: { id: user.id }
        },
      },
    });
  })

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.expCategory.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.$disconnect();
  });


  describe('getCommentsFromDB:', () => {

    test('should get comment from db with valid data', async () => {
      const commentDict = await getCommentsFromDB(project.id);
      expect(commentDict).toHaveProperty(expense.id.toString());
      expect(commentDict[expense.id][0]).toHaveProperty('text', comment.text);
    });

    test('should not get comment from db with invalid data', async () => {
      const commentDict = await getCommentsFromDB(-1);
      expect(commentDict).toEqual({});
    });

    test('should not get comment from db if not saved yet', async () => {
      await prisma.project.deleteMany();
      const commentDict = await getCommentsFromDB(project.id);
      expect(commentDict).toEqual({});
    });
  });


  describe('saveCommentToDb:', () => {
    test('should create new comment with valid data', async () => {
      const data = {
        ...mockdata.comment,
        expense: expense as Prisma.ExpenseCreateNestedOneWithoutCommentsInput,
        user: user as Prisma.UserCreateNestedOneWithoutCommentsInput,
      };
      const createdComment = await saveCommentToDb(expense.id, user.id, data as Prisma.CommentCreateInput);
      expect(createdComment).toHaveProperty('id');
      expect(createdComment).toHaveProperty('text', comment.text);
    });

    test('should not create new comment with missing input', async () => {
      const data = {
        expense: expense as Prisma.ExpenseCreateNestedOneWithoutCommentsInput,
        user: user as Prisma.UserCreateNestedOneWithoutCommentsInput,
      };
      const wrapper = async () => {
        try {
          await saveCommentToDb(expense.id, user.id, data as Prisma.CommentCreateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('deleteCommentFromDB:', () => {

    test('should delete comment with valid data', async () => {
      const deletedComment = await deleteCommentFromDB(comment.id);
      expect(deletedComment).toHaveProperty('id', comment.id);
    });

    test('should not delete comment if comment not saved yet', async () => {
      await prisma.comment.deleteMany();
      const wrapper = async () => {
        try {
          await deleteCommentFromDB(comment.id);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });
});