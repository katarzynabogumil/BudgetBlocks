import { ExpenseModel } from "./expense.model";
import { UserModel } from "./user.model";

export interface CommentModel {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  text: string;
  expense?: ExpenseModel;
  expenseId?: number;
  user?: UserModel;
  userId?: number;
}

export interface CommentDictModel { [key: number]: CommentModel[] } 