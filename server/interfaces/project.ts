export interface Project {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  type: string;
  budget: number;
  currency: string;
  dateFrom: string;
  dateTo: string;
  area: number;
  noOfGuests: number;
  occasion: string;
  description: string;
}