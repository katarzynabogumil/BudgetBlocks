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

  afterEach(async () => {
    await prisma.user.deleteMany();
  })

  afterAll(async () => {
    await prisma.$disconnect();
    server.close();
  });

  describe('GET /user', () => {
    beforeEach(async () => {
      await prisma.user.create({ data: mockdata.user });
    });

    it('should get user to db when valid data provided', async () => {
      const res = await request(server)
        .get('/user')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('sub', mockdata.user.sub);
    });
  });

});