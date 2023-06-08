import { Expense } from "./expense";
import { User } from "./user";

export interface Comment {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  text: string;
  expense?: Expense;
  expenseId?: number;
  user?: User;
  userId?: number;
}