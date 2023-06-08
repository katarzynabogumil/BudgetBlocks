import { UserModel } from './user.model';
import { CommentModel } from './comment.model';
import { ProjectModel } from './project.model';

export interface ExpenseModel {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  project?: ProjectModel;
  projectId?: number;
  name: string;
  category: string;
  cost: number;
  currency: string;
  photo?: string;
  notes?: string;
  optional?: boolean;
  upvotes?: UserModel[];
  downvotes?: UserModel[];
  comments?: CommentModel[];
}