import { UserModel } from './user.model';
import { CommentModel } from './comment.model';

export interface ExpenseWithoutRelModel {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  category: string;
  cost: number;
  currency: string;
  photo: string;
  notes: string;
  optional: boolean;
}

export interface ExpenseModel {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  category: string;
  cost: number;
  currency: string;
  photo: string;
  notes: string;
  optional: boolean;
  upvotes: UserModel[];
  downvotes: UserModel[];
  comments: CommentModel[];
}