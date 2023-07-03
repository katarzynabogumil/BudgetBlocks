import prisma from '../models/prisma';
import { app } from '../index';
import { mockdata } from './mocks';
import request from 'supertest';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { User, Project, ExpCategory } from '@prisma/client';

describe('Server tests - expense endpoints:', () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;
  let user: User;
  let project: Project;
  let category: ExpCategory;

  beforeAll((done) => {
    server = app.listen();
    done();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.expCategory.deleteMany();

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
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.expCategory.deleteMany();
    await prisma.$disconnect();
    server.close();
  });


  describe('PUT /categories/:categoryId/:orderId', () => {
    test('should update category in db if saved', async () => {
      category.orderId = 2;
      const res = await request(server)
        .put(`/categories/${category.id}/${category.orderId}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('orderId', category.orderId);
    });

    test('should not update category in db if not saved', async () => {
      const res = await request(server)
        .put(`/categories/-1/${category.orderId}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(500);
    });
  });
});
