import { ExpenseModel } from "./expense.model";
import { UserModel } from "./user.model";
import { ExpCategoryModel } from './expCategory.model';
import { CurrencyRatesModel } from "./currencyRates.model";

export interface CreateProjectModel {
  name: string;
  type: string;
  budget: number;
  budgetRating?: number;
  currency: string;
  currencyRates?: CurrencyRatesModel;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  area?: number;
  location?: string;
  noOfGuests?: number;
  origin?: string;
  destination?: string;
  occasion?: string;
  description?: string;
  refreshRates?: boolean;
}

export interface ProjectModel {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  owners?: UserModel[];
  invitedUsers?: UserModel[];
  name: string;
  type: string;
  budget: number;
  budgetRating?: number;
  currency: string;
  currencyRates?: CurrencyRatesModel;
  dateFrom?: Date;
  dateTo?: Date;
  area?: number;
  location?: string;
  noOfGuests?: number;
  origin?: string;
  destination?: string;
  occasion?: string;
  description?: string;
  expenses: ExpenseModel[];
  categories?: ExpCategoryModel[];
}

export const EmptyProject = {
  name: '',
  type: '',
  budget: 0,
  currency: 'EUR',
  expenses: [],
}