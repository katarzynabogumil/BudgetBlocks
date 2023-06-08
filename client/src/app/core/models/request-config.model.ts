import { UserModel } from './user.model';
import { ProjectModel } from './project.model';
import { ExpenseModel } from './expense.model';
import { CommentModel } from './comment.model';

export interface RequestConfigModel {
  url: string;
  method: string;
  body?: UserModel | ProjectModel | ExpenseModel | CommentModel,
  headers: {
    [index: string]: string;
  };
}
