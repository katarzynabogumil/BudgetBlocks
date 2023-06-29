// import dotenv from 'dotenv';
// dotenv.config({ override: true });
// process.env.PORT = '3000';

import { app } from '../index';
import request from 'supertest';


describe('Test of tests', () => {
  test('1 should equal 1', () => {
    expect(1).toBe(1);
  });
});

describe('App GET /', () => {
  beforeAll((done) => {
    done();
  });
  afterAll((done) => {
    done();
  });
  it('returns status code 200 when server available', async () => {
    const res = await request(app).get('/user');
    expect(res.statusCode).toEqual(200);
  });
});

// describe('Not found endpoint', () => {
//   test('should return "Route not found" for any URL other than /openai/chat', async () => {
//     const urlsToTest = ['/', '/openai', '/openai/chatroom', '/api', '/users'];

//     for (const url of urlsToTest) {
//       const res = await request(app).get(url);
//       expect(res.status).toEqual(404);
//       expect(res.text).toEqual('Route not found');
//     }
//   });
// });

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