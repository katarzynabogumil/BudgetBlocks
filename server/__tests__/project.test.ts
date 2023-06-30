import prisma from '../models/prisma';
import { app } from '../index';
import { mockdata } from './mocks';
import request from 'supertest';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { User } from '@prisma/client';

describe('Server tests - project endpoints:', () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;
  let user: User;

  beforeAll((done) => {
    server = app.listen();
    done();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    user = await prisma.user.create({ data: mockdata.user });
  })

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.$disconnect();
    server.close();
  });


  describe('GET /projects', () => {
    it('should get projects from db if saved', async () => {
      await prisma.project.create({
        data: {
          ...mockdata.project,
          owners: {
            connect: { id: user.id }
          }
        },
      });

      const res = await request(server)
        .get('/projects')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name', mockdata.project.name);
    });

    it('should not get projects from db if not saved', async () => {
      const res = await request(server)
        .get('/projects')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
  });


  describe('GET /projects/invitations', () => {
    it('should get projects invitations from db if saved', async () => {
      await prisma.project.create({
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

      const res = await request(server)
        .get('/projects/invitations')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name', mockdata.project.name);
    });

    it('should not get projects invitations from db if not saved', async () => {
      const res = await request(server)
        .get('/projects/invitations')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
  });


  describe('POST /project', () => {
    it('should save project to db', async () => {
      const res = await request(server)
        .post('/project')
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(mockdata.project);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', mockdata.project.name);
    });

    it('should not save invalid project to db', async () => {
      const { name: _, ...invalidData } = mockdata.project;
      const res = await request(server)
        .post('/project')
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(invalidData);
      expect(res.statusCode).toEqual(500);
    });

    it('should not save project to db if user does not exist', async () => {
      await prisma.user.deleteMany();
      const res = await request(server)
        .post('/project')
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(mockdata.project);
      expect(res.statusCode).toEqual(500);
    });
  });


  describe('GET /project/:id', () => {
    it('should get project from db if saved', async () => {
      const project = await prisma.project.create({
        data: {
          ...mockdata.project,
          owners: {
            connect: { id: user.id }
          }
        },
      });

      const res = await request(server)
        .get(`/project/${project.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', mockdata.project.name);
    });

    it('should not get project from db if not saved', async () => {
      const res = await request(server)
        .get('/project/-1')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('');
    });
  });


  describe('PUT /project/:id', () => {
    it('should update project in db if saved', async () => {
      const project = await prisma.project.create({
        data: {
          ...mockdata.project,
          owners: {
            connect: { id: user.id }
          }
        },
      });

      project.name = 'New name';
      const res = await request(server)
        .put(`/project/${project.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(project);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', project.name);
    });

    it('should not save invalid project to db', async () => {
      const project = await prisma.project.create({
        data: {
          ...mockdata.project,
          owners: {
            connect: { id: user.id }
          }
        },
      });

      const { name: _, ...invalidData } = mockdata.project;
      const res = await request(server)
        .put(`/project/${project.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(invalidData);
      expect(res.statusCode).toEqual(500);
    });

    it('should not update project in db if not saved', async () => {
      const name = 'New name';
      const res = await request(server)
        .put('/project/-1')
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send({ name });
      expect(res.statusCode).toEqual(500);
    });
  });


  describe('DELETE /project/:id', () => {
    it('should delete project in db if saved', async () => {
      const project = await prisma.project.create({
        data: {
          ...mockdata.project,
          owners: {
            connect: { id: user.id }
          }
        },
      });

      const res = await request(server)
        .delete(`/project/${project.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
      expect(res.statusCode).toEqual(204);
    });

    it('should not delete project in db if not saved', async () => {
      const res = await request(server)
        .delete('/project/-1')
        .set('Authorization', `Bearer ${mockdata.token}`)
      expect(res.statusCode).toEqual(500);
    });
  });
});
