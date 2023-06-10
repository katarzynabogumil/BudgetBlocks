import { ProjectModel } from './project.model';
import { ExpenseModel } from "./expense.model";

export interface ExpCategoryModel {
  id?: number;
  project?: ProjectModel;
  expenses?: ExpenseModel[];
  orderId: number;
  category: string;
}

export const EmptyExpCategory = {
  category: '',
  orderId: 0,
}