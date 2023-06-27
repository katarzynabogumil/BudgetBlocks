import { CommentModel } from './comment.model';
import { ProjectModel } from './project.model';
import { CreateExpCategoryModel, EmptyExpCategory, ExpCategoryModel } from './expCategory.model';

export interface CreateExpenseModel {
  name: string;
  category: CreateExpCategoryModel;
  cost: number;
  calcCost?: number;
  currency: string;
  link?: string;
  photo?: string;
  notes?: string;
  formCategory?: string,
  newCategory?: string,
  optional?: boolean,
}

export interface ExpenseModel {
  id: number;
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
  upvotes?: string[];
  downvotes?: string[];
  comments?: CommentModel[];
  selected?: boolean,
  showDetails?: boolean,
  formCategory?: string,
}

export const EmptyExpense = {
  id: -1,
  name: '',
  cost: 0,
  currency: 'EUR',
  category: EmptyExpCategory,
}