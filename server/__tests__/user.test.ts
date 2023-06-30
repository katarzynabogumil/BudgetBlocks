import prisma from '../models/prisma';
import { app } from '../index';
import { mockdata } from './mocks';
import request from 'supertest';
import { IncomingMessage, Server, ServerResponse } from 'http';

describe('Server tests - user endpoints:', () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;

  beforeAll((done) => {
    server = app.listen();
    done();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  })

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    server.close();
  });

  describe('GET /user', () => {
    it('should get authorized user from db if saved', async () => {
      await prisma.user.create({ data: mockdata.user });
      const res = await request(server)
        .get('/user')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('sub', mockdata.user.sub);
    });

    it('should not get user from db if not saved', async () => {
      const res = await request(server)
        .get('/user')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('');
    });
  });

  describe('POST /user', () => {
    it('should save user to db', async () => {
      const res = await request(server)
        .post('/user')
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(mockdata.user);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('sub', mockdata.user.sub);
    });

    it('should not save invalid user to db', async () => {
      const { sub: _, ...invalidData } = mockdata.user;
      const res = await request(server)
        .post('/user')
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(invalidData);
      expect(res.statusCode).toEqual(500);
    });

    it('should not save user duplicate to db', async () => {
      await prisma.user.create({ data: mockdata.user });
      const res = await request(server)
        .post('/user')
        .set('Authorization', `Bearer ${mockdata.token}`)
        .set('Content-Type', 'application/json')
        .send(mockdata.user);
      expect(res.statusCode).toEqual(500);
    });
  });

});