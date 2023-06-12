// @ts-nocheck 
'use strict';

import { Prisma } from '@prisma/client';
import * as dotenv from "dotenv";
dotenv.config();

type mockdata = {
  users: Prisma.UserCreateInput[],
  projects: [string, Prisma.ProjectCreateInput][],
  categories: [number, Prisma.ExpCategoryCreateInput][],
  expenses: [number, ExpCreate][],
}

type ExpCreate = Prisma.ExpenseCreateInput & {
  category: {
    category: string,
    orderId: number
  }
}

export const mockdata: mockdata = {
  users: [
    {
      sub: process.env.MOCK_USER_1 || '',
      firstName: 'katarzyna@example.com',
      lastName: 'katarzyna@example.com',
      nickname: 'katarzyna',
      email: 'katarzyna@example.com'
    },
    {
      sub: process.env.MOCK_USER_2 || '',
      firstName: 'bart@example.com',
      lastName: 'bart@example.com',
      nickname: 'bart',
      email: 'bart@example.com'
    }
  ],
  projects: [
    [
      process.env.MOCK_USER_1 || '',
      {
        name: "Summer Vacation",
        type: "trip",
        budget: 2000,
        currency: "EUR",
        dateFrom: "2023-07-15T00:00:00.000Z",
        dateTo: "2023-07-30T00:00:00.000Z",
        area: null,
        location: null,
        noOfGuests: 2,
        occasion: null,
        origin: "Berlin",
        destination: "Barcelona",
        description: "Enjoy a summer vacation in the vibrant city of Barcelona.",
      },
    ]
  ],
  categories: [
    [
      1,
      { category: 'Flights', orderId: 1 },
    ],
    [
      1,
      { category: 'Accommodation', orderId: 2 },
    ],
    [
      1,
      { category: 'Transportation', orderId: 3 },
    ],
    [
      1,
      { category: 'Activities', orderId: 4 },
    ],
  ],
  expenses: [
    [
      1,
      {
        name: "Morning Flights",
        cost: 300,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Departure time: 8:00 AM",
        category: { category: 'Flights', orderId: 1 }
      },
    ],
    [
      1,
      {
        name: "Evening Flights",
        cost: 250,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Departure time: 6:00 PM",
        category: { category: 'Flights', orderId: 1 }
      },
    ],
    [
      1,
      {

        name: "Red-Eye Flights",
        cost: 200,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Departure time: 11:00 PM",
        category: { category: 'Flights', orderId: 1 }
      },
    ],
    [
      1,
      {
        name: "Luxury Hotel",
        cost: 1200,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "5-star hotel with great amenities",
        category: { category: 'Accommodation', orderId: 2 }
      },
    ],
    [
      1,
      {
        name: "Boutique Hotel",
        cost: 800,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Charming hotel in the city center",
        category: { category: 'Accommodation', orderId: 2 }
      },
    ],
    [
      1,
      {
        name: "Apartment Rental",
        cost: 600,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Self-catering apartment for more flexibility",
        category: { category: 'Accommodation', orderId: 2 }
      },
    ],
    [
      1,
      {
        name: "Car Rental",
        cost: 200,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Freedom to travel at your own pace",
        category: { category: 'Transportation', orderId: 3 }
      },
    ],
    [
      1,
      {
        name: "Public Transportation",
        cost: 50,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Explore the city like a local",
        category: { category: 'Transportation', orderId: 3 }
      },
    ],
    [
      1,
      {
        name: "City Tour",
        cost: 50,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Guided tour of the main attractions",
        category: { category: 'Activities', orderId: 4 }
      },
    ],
    [
      1,
      {
        name: "Museum Visits",
        cost: 30,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Explore the city's rich cultural heritage",
        category: { category: 'Activities', orderId: 4 }
      },
    ],
    [
      1,
      {
        name: "Fine Dining Restaurant",
        cost: 200,
        currency: "EUR",
        link: null,
        photo: null,
        notes: "Indulge in gourmet cuisine",
        category: { category: 'Activities', orderId: 4 }
      },
    ],
  ]
}

