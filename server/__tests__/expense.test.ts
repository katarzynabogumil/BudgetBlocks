import prisma from '../models/prisma';
import { app } from '../index';
import { mockdata } from './mocks';
import request from 'supertest';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { User, Project, ExpCategory, Expense, Prisma } from '@prisma/client';

describe('Server tests - expense endpoints:', () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;
  let user: User;
  let project: Project;
  let category: ExpCategory;
  let expense: Expense;
  let newExpense: Prisma.ExpenseCreateInput & { category: Prisma.ExpCategoryCreateInput };

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

    newExpense = {
      ...mockdata.expense,
      project: {},
      category: {
        ...mockdata.category,
        project: {}
      }
    };
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.expCategory.deleteMany();
    await prisma.expense.deleteMany();
    await prisma.$disconnect();
    server.close();
  });


  describe('POST /project/:projectId/expense', () => {
    test('should save expense to db', async () => {
      const res = await request(server)
        .post(`/project/${project.id}/expense`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(newExpense);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', mockdata.expense.name);
    });

    test('should not save invalid expense to db', async () => {
      const { name: _, ...invalidData } = newExpense;
      const res = await request(server)
        .post(`/project/${project.id}/expense`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(invalidData);
      expect(res.statusCode).toEqual(500);
    });

    test('should not save expense to db if expense does not exist', async () => {
      await prisma.project.deleteMany();
      const res = await request(server)
        .post(`/project/${project.id}/expense`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(newExpense);
      expect(res.statusCode).toEqual(500);
    });
  });


  describe('GET /project/:projectId/expense/:id', () => {
    test('should get expense from db if saved', async () => {
      const res = await request(server)
        .get(`/project/${project.id}/expense/${expense.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', mockdata.expense.name);
    });

    test('should not get expense from db if not saved', async () => {
      const res = await request(server)
        .get(`/project/${project.id}/expense/-1`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('');
    });
  });


  describe('PUT /project/:projectId/expense/:id', () => {
    test('should update expense in db if saved', async () => {
      newExpense.name = 'New name';
      const res = await request(server)
        .put(`/project/${project.id}/expense/${expense.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(newExpense);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', newExpense.name);
    });

    test('should not update invalid expense in db', async () => {
      const { name: _, ...invalidData } = newExpense;
      const res = await request(server)
        .put(`/project/${project.id}/expense/${expense.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(invalidData);
      expect(res.statusCode).toEqual(500);
    });

    test('should not update expense in db if not saved', async () => {
      newExpense.name = 'New name';
      const res = await request(server)
        .put(`/project/${project.id}/expense/-1`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(newExpense);
      expect(res.statusCode).toEqual(500);
    });
  });


  describe('DELETE /project/:projectId/expense/:id', () => {
    test('should delete expense in db if saved', async () => {
      const res = await request(server)
        .delete(`/project/${project.id}/expense/${expense.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', expense.name);
    });

    test('should not delete expense in db if not saved', async () => {
      const res = await request(server)
        .delete(`/project/${project.id}/expense/-1`)
        .set('Authorization', `Bearer ${mockdata.token}`)
      expect(res.statusCode).toEqual(500);
    });
  });


  describe('PUT /project/:projectId/expense/:id/:direction', () => {
    test('should add vote to expense in db if saved', async () => {
      const res = await request(server)
        .put(`/project/${project.id}/expense/${expense.id}/up`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', expense.name);
      expect(res.body).toHaveProperty('upvotes', [user.sub]);
    });

    test('should not add vote to expense with invalid data', async () => {
      const res = await request(server)
        .put(`/project/${project.id}/expense/-1/up`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(500);
    });

    test('should not add vote to expense to db if not saved', async () => {
      await prisma.expense.deleteMany();
      const res = await request(server)
        .put(`/project/${project.id}/expense/${expense.id}/up`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(500);
    });

    test('should not add vote to expense with no direction', async () => {
      const res = await request(server)
        .put(`/project/${project.id}/expense/${expense.id}/updown`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(500);
    });
  });
});
