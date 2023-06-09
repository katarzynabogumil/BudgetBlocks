import { ExpenseModel } from "./expense.model";
import { UserModel } from "./user.model";

export interface ProjectModel {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  owners?: UserModel[];
  invitedUsers?: UserModel[];
  name: string;
  type: string;
  budget: number;
  currency: string;
  dateFrom?: string;
  dateTo?: string;
  area?: number;
  noOfGuests?: number;
  destination?: string;
  occasion?: string;
  description?: string;
  expenses?: ExpenseModel[];
}

export const EmptyProject = {
  name: '',
  type: '',
  budget: 0,
  currency: 'EUR',
}