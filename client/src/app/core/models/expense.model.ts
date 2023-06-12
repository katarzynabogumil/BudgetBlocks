import { UserModel } from './user.model';
import { CommentModel } from './comment.model';
import { ProjectModel } from './project.model';
import { EmptyExpCategory, ExpCategoryModel } from './expCategory.model';

export interface ExpenseModel {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  project?: ProjectModel;
  projectId?: number;
  name: string;
  category: ExpCategoryModel;
  cost: number;
  calcCost?: number;
  currency: string;
  link?: string;
  photo?: string;
  notes?: string;
  optional?: boolean;
  upvotes?: string[];
  downvotes?: string[];
  comments?: CommentModel[];
  selected?: boolean,
  showDetails?: boolean,
  formCategory?: string,
}

export const EmptyExpense = {
  name: '',
  cost: 0,
  currency: 'EUR',
  category: EmptyExpCategory,
}