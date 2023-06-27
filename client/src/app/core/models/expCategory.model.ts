import { ProjectModel } from './project.model';
import { ExpenseModel } from './expense.model';

export interface CreateExpCategoryModel {
  orderId: number;
  category: string;
  optional?: boolean;
}

export interface ExpCategoryModel {
  id: number;
  project?: ProjectModel;
  expenses?: ExpenseModel[];
  orderId: number;
  category: string;
  optional?: boolean;
}

export const EmptyCreateExpCategory = {
  category: '',
  orderId: 0,
}

export const EmptyExpCategory = {
  id: -1,
  category: '',
  orderId: 0,
}