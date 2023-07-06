import { CategoryMock } from "./category.mocks";

const votes: string[] = [];

export const ExpenseMock = {
  id: 1,
  name: 'Morning Flights',
  cost: 724,
  currency: 'EUR',
  link: undefined,
  photo: 'https://res.cloudinary.com/dpx650seh/image/upload/c_fill,h_230,w_150/v1687800663/flights_redj4q.webp',
  notes: `Departure time: 6:00 AM. I'm too old for that.`,
  category: CategoryMock,
  upvotes: votes,
  downvotes: votes,
}