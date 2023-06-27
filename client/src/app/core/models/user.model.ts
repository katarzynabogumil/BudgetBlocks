import { ProjectModel } from './project.model';
import { ExpenseModel } from './expense.model';
import { CommentModel } from './comment.model';

export interface UserModel {
  id?: number;
  sub: string;
  firstName: string;
  lastName?: string;
  nickname?: string;
  email?: string;
  createdAt?: Date;
  projects?: ProjectModel[];
  projectInvitations?: ProjectModel[];
  upvotedExpenses?: ExpenseModel[];
  downvotedExpenses?: ExpenseModel[];
  comments?: CommentModel[];
}