import { AppErrorModel } from './app-error.model';
import { CommentDictModel, CommentModel } from './comment.model';
import { CurrencyRatesModel } from './currencyRates.model';
import { ExpenseModel } from './expense.model';
import { ProjectModel } from './project.model';
import { RatingModel } from './rating.model';
import { UserModel } from './user.model';

export interface ApiResponseModel {
  data: unknown;
  error: AppErrorModel | null;
}

export interface ApiResponseUserModel {
  data: UserModel;
  error: AppErrorModel | null;
}

export interface ApiResponseProjectModel {
  data: ProjectModel;
  error: AppErrorModel | null;
}

export interface ApiResponseProjectModelArr {
  data: ProjectModel[];
  error: AppErrorModel | null;
}

export interface ApiResponseExpenseModel {
  data: ExpenseModel;
  error: AppErrorModel | null;
}

export interface ApiResponseExpenseModelArr {
  data: ExpenseModel[];
  error: AppErrorModel | null;
}

export interface ApiResponseCommentDictModel {
  data: CommentDictModel;
  error: AppErrorModel | null;
}

export interface ApiResponseCommentModel {
  data: CommentModel;
  error: AppErrorModel | null;
}

export interface ApiResponseRatingModel {
  data: RatingModel;
  error: AppErrorModel | null;
}

export interface ApiResponseCurrenciesModel {
  data: CurrencyRatesModel;
  error: AppErrorModel | null;
}