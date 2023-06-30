import { app } from '../index';
import { mockdata } from './mocks';
import request from 'supertest';
import { IncomingMessage, Server, ServerResponse } from 'http';

describe('Server authentication tests:', () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;

  beforeAll((done) => {
    server = app.listen();
    done();
  });
  afterAll((done) => {
    server.close(done);
  });

  describe('Invalid endpoints:', () => {
    it('should return status code 404 when route does not exist', async () => {
      const res = await request(server).get('/');
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Not Found');
    });
  });

  describe('Authentication:', () => {
    it('should return status code 401 when Auth0 token not provided', async () => {
      const res = await request(server)
        .get('/user')
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Requires authentication');
    });

    it('should return status code 401 when wrong Auth0 token provided', async () => {
      const res = await request(server)
        .get('/user')
        .set('Authorization', `Bearer 0`);
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Bad credentials');
    });

    it('should return status code 200 when Auth0 token provided', async () => {
      const res = await request(server)
        .get('/user')
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
    });
  });
});