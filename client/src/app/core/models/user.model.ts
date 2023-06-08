// import { Project } from './project';
// import { Expense } from './expense';
// import { Comment } from './comment';

export interface UserModel {
  id?: number;
  sub: string;
  firstName: string;
  lastName?: string;
  nickname?: string;
  email?: string;
  createdAt?: string;
  // projects: Project[];
  // projectInvitations: Project[];
  // upvotedExpenses: Expense[];
  // downvotedExpenses: Expense[];
  // comments: Comment[];
}