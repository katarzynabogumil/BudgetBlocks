import * as dotenv from 'dotenv';
dotenv.config({ path: './.env.test' });

export const mockdata = {
  token: process.env.AUTH0_TEST_TOKEN,
  user: {
    sub: process.env.AUTH0_TEST_TOKEN_SUB || '',
    firstName: process.env.MOCK_USER_1_FNAME || '',
    lastName: process.env.MOCK_USER_1_LNAME || '',
    nickname: process.env.MOCK_USER_1_NICKNAME || '',
    email: process.env.MOCK_USER_1_EMAIL || '',
  },
  invitedUser: {
    sub: 'mocksub',
    firstName: 'firstName',
    lastName: 'lastName',
    nickname: 'nickname',
    email: 'email@email.com',
  },
  project: {
    name: 'Summer Vacation',
    type: 'trip',
    budget: 5000,
    currency: 'EUR',
    dateFrom: '2023-07-15T00:00:00.000Z',
    dateTo: '2023-07-30T00:00:00.000Z',
    area: null,
    location: null,
    noOfGuests: 2,
    occasion: null,
    origin: 'Berlin',
    destination: 'Barcelona',
    description: 'Enjoy a summer vacation - sightseeing, sunbathing and sangria.',
  },
  expense: {
    name: 'Morning Flights',
    cost: 724,
    currency: 'EUR',
    link: null,
    photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687800663/flights_redj4q.webp',
    notes: `Departure time: 6:00 AM. I'm too old for that.`,
  },
  category: {
    category: 'Flights',
    orderId: 1,
  },
  comment: {
    text: 'Comment',
  },
}