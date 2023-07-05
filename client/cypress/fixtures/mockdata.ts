import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

export const mockdata = {
  initialData: {
    user:
    {
      sub: Cypress.env('sub'),
      firstName: Cypress.env('firstName'),
      nickname: Cypress.env('nickname'),
      email: Cypress.env('email'),
    },
    project: {
      name: 'Summer',
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
    expenses: [
      {
        name: 'Morning Flights',
        cost: 724,
        currency: 'EUR',
        link: null,
        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687800663/flights_redj4q.webp',
        notes: `Departure time: 6:00 AM. I'm too old for that.`,
      },
      {
        name: 'Most Convenient Flights',
        cost: 927,
        currency: 'EUR',
        link: null,
        photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687800663/flights_redj4q.webp',
        notes: 'Departure at 10:00 AM',
      },
    ],
    category: {
      category: 'Flights',
      orderId: 1,
    },
    comment: {
      text: 'Comment',
    },
  },
  invitedUser: {
    user:
    {
      sub: Cypress.env('sub2'),
      firstName: Cypress.env('firstName2'),
      nickname: Cypress.env('nickname2'),
      email: Cypress.env('email2'),
    },
  }
}