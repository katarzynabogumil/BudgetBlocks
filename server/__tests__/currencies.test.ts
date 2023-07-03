import { app } from '../index';
import { mockdata } from './mocks';
import request from 'supertest';
import { IncomingMessage, Server, ServerResponse } from 'http';

describe('Server tests - currencies endpoints:', () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;

  beforeAll((done) => {
    server = app.listen();
    done();
  });

  afterAll(async () => {
    server.close();
  });


  describe('GET /currencies/:base', () => {
    test('should provide currency rates if valid base provided', async () => {
      const res = await request(server)
        .get(`/currencies/EUR`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.rates).toHaveProperty('EUR', 1);
    });

    test('should not provide currency rates if invalid base provided', async () => {
      const res = await request(server)
        .get(`/currencies/EEE`)
        .set('Authorization', `Bearer ${mockdata.token}`);
      console.log(res)
      expect(res.statusCode).toEqual(500);
    });
  });
});
