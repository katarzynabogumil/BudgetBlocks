export interface CommentModel {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  text: string;
}

export interface CommentDictModel { [key: number]: CommentModel[] } 