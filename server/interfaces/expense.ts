import { User } from './user';
import { Comment } from './comment';
import { Project } from './project';

export interface Expense {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  project?: Project;
  projectId?: number;
  name: string;
  category: string;
  cost: number;
  currency: string;
  photo?: string;
  notes?: string;
  optional?: boolean;
  upvotes?: User[];
  downvotes?: User[];
  comments?: Comment[];
}