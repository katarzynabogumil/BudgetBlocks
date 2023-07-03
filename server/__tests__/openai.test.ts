import prisma from '../models/prisma';
import { app } from '../index';
import { mockdata } from './mocks';
import request from 'supertest';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Project, User } from '@prisma/client';

describe('Server tests - currencies endpoints:', () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;
  let user: User;
  let project: Project;

  beforeAll((done) => {
    server = app.listen();
    done();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
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
  })

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.$disconnect();
    server.close();
  });


  describe('GET /rating/:projectId', () => {
    test('should provide rating rates if valid data provided', async () => {
      const res = await request(server)
        .get(`/rating/${project.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('rating');
    });

    test('should not provide rating rates if invalid data provided', async () => {
      const res = await request(server)
        .get(`/rating/-1`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(500);
    });
  });


  describe('GET /missing-categories/:projectId', () => {
    test('should provide rating rates if valid data provided', async () => {
      const res = await request(server)
        .get(`/missing-categories/${project.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('categories');
    });

    test('should not provide rating rates if invalid data provided', async () => {
      const res = await request(server)
        .get(`/missing-categories/-1`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(500);
    });
  });
});
