import { ExpenseModel } from "./expense.model";
import { UserModel } from "./user.model";

export interface CommentModel {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  text: string;
  expense?: ExpenseModel;
  expenseId?: number;
  user?: UserModel;
  userId?: number;
}