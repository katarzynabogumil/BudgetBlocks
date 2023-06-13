import { AppErrorModel } from './app-error.model';
import { CommentModel } from './comment.model';
import { ExpenseModel } from './expense.model';
import { ProjectModel } from './project.model';
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

export interface ApiResponseCommentModel {
  data: CommentModel;
  error: AppErrorModel | null;
}

export interface ApiResponseCommentModelArr {
  data: CommentModel[];
  error: AppErrorModel | null;
}


export interface ApiResponseExpenseModelArr {
  data: ExpenseModel[];
  error: AppErrorModel | null;
}

