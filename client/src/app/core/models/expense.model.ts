import { UserModel } from './user.model';
import { CommentModel } from './comment.model';
import { ProjectModel } from './project.model';
import { ExpCategoryModel } from './expCategory.model';

export interface ExpenseModel {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  project?: ProjectModel;
  projectId?: number;
  name: string;
  category?: ExpCategoryModel;
  cost: number;
  currency: string;
  photo?: string;
  notes?: string;
  optional?: boolean;
  upvotes?: UserModel[];
  downvotes?: UserModel[];
  comments?: CommentModel[];
}

export const EmptyExpense = {
  name: '',
  cost: 0,
  currency: 'EUR',
}