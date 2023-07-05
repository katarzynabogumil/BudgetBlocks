import { ExpenseModel } from "../models"

const expenses: ExpenseModel[] = []

export const ProjectMock = {
  id: 1,
  name: 'Summer',
  type: 'trip',
  budget: 5000,
  currency: 'EUR',
  dateFrom: undefined,
  dateTo: undefined,
  area: undefined,
  location: undefined,
  noOfGuests: 2,
  occasion: undefined,
  origin: 'Berlin',
  destination: 'Barcelona',
  description: 'Enjoy a summer vacation - sightseeing, sunbathing and sangria.',
  expenses: expenses,
}
