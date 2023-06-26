import { UserModel } from './user.model';
import { CreateProjectModel, ProjectModel } from './project.model';
import { CreateExpenseModel, ExpenseModel } from './expense.model';
import { CommentModel } from './comment.model';

export interface RequestConfigModel {
  url: string;
  method: string;
  body?: UserModel | CreateProjectModel | CreateExpenseModel | CommentModel | { email: string },
  headers: {
    [index: string]: string;
  };
}
