import prisma from '../models/prisma';
import { app } from '../index';
import { mockdata } from './mocks';
import request from 'supertest';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Project, User } from '@prisma/client';

describe('Server tests - project endpoints:', () => {
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


  describe('GET /projects', () => {
    test('should get projects from db if saved', async () => {
      const res = await request(server)
        .get('/projects')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name', mockdata.project.name);
    });

    test('should not get projects from db if not saved', async () => {
      await prisma.project.deleteMany();
      const res = await request(server)
        .get('/projects')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
  });


  describe('GET /projects/invitations', () => {
    test('should get projects invitations from db if saved', async () => {
      const res = await request(server)
        .get('/projects/invitations')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name', mockdata.project.name);
    });

    test('should not get projects invitations from db if not saved', async () => {
      await prisma.project.deleteMany();
      const res = await request(server)
        .get('/projects/invitations')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
  });


  describe('POST /project', () => {
    test('should save project to db', async () => {
      const res = await request(server)
        .post('/project')
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(mockdata.project);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', mockdata.project.name);
    });

    test('should not save invalid project to db', async () => {
      const { name: _, ...invalidData } = mockdata.project;
      const res = await request(server)
        .post('/project')
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(invalidData);
      expect(res.statusCode).toEqual(500);
    });

    test('should not save project to db if user does not exist', async () => {
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
    test('should get project from db if saved', async () => {
      const res = await request(server)
        .get(`/project/${project.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', mockdata.project.name);
    });

    test('should not get project from db if not saved', async () => {
      const res = await request(server)
        .get('/project/-1')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('');
    });
  });


  describe('PUT /project/:id', () => {
    test('should update project in db if saved', async () => {
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

    test('should not save invalid project to db', async () => {
      const { name: _, ...invalidData } = mockdata.project;
      const res = await request(server)
        .put(`/project/${project.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(invalidData);
      expect(res.statusCode).toEqual(500);
    });

    test('should not update project in db if not saved', async () => {
      await prisma.project.deleteMany();
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
    test('should delete project in db if saved', async () => {
      const res = await request(server)
        .delete(`/project/${project.id}`)
        .set('Authorization', `Bearer ${mockdata.token}`)
      expect(res.statusCode).toEqual(204);
    });

    test('should not delete project in db if not saved', async () => {
      const res = await request(server)
        .delete('/project/-1')
        .set('Authorization', `Bearer ${mockdata.token}`)
      expect(res.statusCode).toEqual(500);
    });
  });


  describe('POST /project/:projectId/adduser', () => {
    test('should add user to project with valid data', async () => {
      const invitedUser = await prisma.user.create({ data: mockdata.invitedUser });
      const res = await request(server)
        .post(`/project/${project.id}/adduser`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(invitedUser);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.invitedUsers[1]).toHaveProperty('id', invitedUser.id);
      expect(res.body.invitedUsers[1]).toHaveProperty('email', invitedUser.email);
    });

    test('should not add user to project if user not saved yet', async () => {
      const res = await request(server)
        .post(`/project/${project.id}/adduser`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send({ email: 'ex@example.com' });
      expect(res.statusCode).toEqual(404);
    });
  });


  describe('PUT /project/:projectId/accept', () => {
    test('should accept invitation with valid data', async () => {
      const res = await request(server)
        .put(`/project/${project.id}/accept`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', project.name);
    });

    test('should not accept invitation if user not invited yet', async () => {
      await prisma.project.deleteMany();
      project = await prisma.project.create({
        data: {
          ...mockdata.project,
          owners: {
            connect: { id: user.id }
          },
        },
      });
      const res = await request(server)
        .put(`/project/${project.id}/accept`)
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(404);
    });
  });
});
