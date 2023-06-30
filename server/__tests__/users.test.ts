// import dotenv from 'dotenv';
// dotenv.config({ override: true });
// process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

import { app } from '../index';
import { mockdata } from './mocks';
import request from 'supertest';
import { IncomingMessage, Server, ServerResponse } from 'http';

describe('Server tests:', () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;

  beforeAll((done) => {
    server = app.listen();
    done();
  });
  afterAll((done) => {
    server.close(done);
  });

  describe('Invalid endpoints:', () => {
    it('returns status code 404 when route does not exist', async () => {
      const res = await request(server).get('/');
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Not Found');
    });
  });

  describe('Authentication:', () => {
    it('returns status code 401 when Auth0 token not provided', async () => {
      const res = await request(server)
        .get('/user')
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Requires authentication');
    });

    it('returns status code 401 when wrong Auth0 token provided', async () => {
      const res = await request(server)
        .get('/user')
        .set('Authorization', `Bearer 0`);
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Bad credentials');
    });

    it('returns status code 200 when Auth0 token provided', async () => {
      const res = await request(server)
        .get('/user')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
    });
  });
});

// describe('...', () => {
//   test('should return 200 if request is valid', async () => {
//     await request(app)
//       .post('/')
//       .set('Content-Type', 'application/json')
//       .send({ message: '' })
//       .expect(200);
//   });

//   test('should return ...', async () => {
//     await request(app)
//       .post('/')
//       .send('')
//       .expect(400);
//   });

//   test('should return 400 if request if there is no ... property', async () => {
//     await request(app)
//       .post('/')
//       .set('Content-Type', 'application/json')
//       .send({ messages: '' })
//       .expect(400);
//   });
// });