import { Prisma } from '@prisma/client';

export type CommentModel = Prisma.CommentGetPayload<{
  include: {
    user: true,
  }
}>

export interface CommentDictModel { [key: number]: CommentModel[] } 