import { User } from './user';
import { Comment } from './comment';

export interface ExpenseWithoutRel {
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

export interface Expense {
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
  upvotes: User[];
  downvotes: User[];
  comments: Comment[];
}