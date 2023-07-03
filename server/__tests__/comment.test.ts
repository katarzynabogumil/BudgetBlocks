import prisma from '../models/prisma';
import { app } from '../index';
import { mockdata } from './mocks';
import request from 'supertest';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { User, Project, ExpCategory, Expense, Comment } from '@prisma/client';

describe('Server tests - expense endpoints:', () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;
  let user: User;
  let project: Project;
  let category: ExpCategory;
  let expense: Expense;
  let comment: Comment;

  beforeAll((done) => {
    server = app.listen();
    done();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.expCategory.deleteMany();
    await prisma.expense.deleteMany();

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
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.expCategory.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.$disconnect();
    server.close();
  });


  describe('POST /comment/:expenseId', () => {
    test('should save comment to db', async () => {
      const res = await request(server)
        .post(`/comment/${expense.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(comment);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('text', comment.text);
    });

    test('should not save invalid comment to db', async () => {
      const res = await request(server)
        .post(`/comment/${expense.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send({});
      expect(res.statusCode).toEqual(500);
    });

    test('should not save comment to db if expense does not exist', async () => {
      const res = await request(server)
        .post(`/comment/-1`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(comment);
      expect(res.statusCode).toEqual(500);
    });
  });


  describe('GET /comments/:projectId', () => {
    test('should get comments from db if saved', async () => {
      const res = await request(server)
        .get(`/comments/${project.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty(expense.id.toString());
      expect(res.body[expense.id][0]).toHaveProperty('id', comment.id);
      expect(res.body[expense.id][0]).toHaveProperty('text', comment.text);
    });

    test('should not get comments from db if project not saved', async () => {
      const res = await request(server)
        .get(`/comments/-1`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({});
    });
  });


  describe('DELETE /project/:projectId/expense/:id', () => {
    test('should delete comment in db if saved', async () => {
      const res = await request(server)
        .delete(`/comment/${comment.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('text', comment.text);
    });

    test('should not delete comment in db if not saved', async () => {
      const res = await request(server)
        .delete(`/comment/-1`)
        .set('Authorization', `Bearer ${mockdata.token}`)
      expect(res.statusCode).toEqual(500);
    });
  });
});
