import { AppErrorModel } from './app-error.model';
import { CommentDictModel, CommentModel } from './comment.model';
import { CurrencyRatesModel } from './currencyRates.model';
import { ExpCategoryModel } from './expCategory.model';
import { ExpenseModel } from './expense.model';
import { ProjectModel } from './project.model';
import { RatingModel } from './rating.model';
import { UserModel } from './user.model';

export interface ApiResponseModel {
  data: unknown;
  error: AppErrorModel | null;
}

export interface ApiResponseUserModel {
  data: UserModel | null;
  error: AppErrorModel | null;
}

export interface ApiResponseProjectModel {
  data: ProjectModel | null;
  error: AppErrorModel | null;
}

export interface ApiResponseProjectModelArr {
  data: ProjectModel[] | null;
  error: AppErrorModel | null;
}

export interface ApiResponseExpenseModel {
  data: ExpenseModel | null;
  error: AppErrorModel | null;
}

export interface ApiResponseExpCategoryModel {
  data: ExpCategoryModel | null;
  error: AppErrorModel | null;
}

export interface ApiResponseExpenseModelArr {
  data: ExpenseModel[] | null;
  error: AppErrorModel | null;
}

export interface ApiResponseCommentDictModel {
  data: CommentDictModel | null;
  error: AppErrorModel | null;
}

export interface ApiResponseCommentModel {
  data: CommentModel | null;
  error: AppErrorModel | null;
}

export interface ApiResponseRatingModel {
  data: RatingModel | null;
  error: AppErrorModel | null;
}

export interface ApiResponseCurrenciesModel {
  data: CurrencyRatesModel | null;
  error: AppErrorModel | null;
}