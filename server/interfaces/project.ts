import { Expense } from "./expense";
import { User } from "./user";

export interface Project {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  owners?: User[];
  invitedUsers?: User[];
  name: string;
  type: string;
  budget: number;
  currency: string;
  dateFrom?: string;
  dateTo?: string;
  area?: number;
  noOfGuests?: number;
  occasion?: string;
  description?: string;
  expenses?: Expense[];
}