import { UserModel } from './user.model';
import { ProjectModel } from './project.model';
import { ExpenseWithoutRelModel, ExpenseModel } from './expense.model';
import { CommentModel } from './comment.model';

export interface RequestConfigModel {
  url: string;
  method: string;
  body?: UserModel | ProjectModel | ExpenseWithoutRelModel | ExpenseModel | CommentModel,
  headers: {
    [index: string]: string;
  };
}
