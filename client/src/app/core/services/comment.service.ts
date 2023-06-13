import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseModel, ApiResponseCommentModel, CommentModel, CommentDictModel, RequestConfigModel, ApiResponseCommentDictModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  comments$ = new BehaviorSubject<CommentDictModel>({});
  public comments: CommentDictModel = {};

  constructor(
    public api: ApiService,
  ) { }


  getAllComments = (projectId: number): Observable<ApiResponseCommentDictModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/comments/${projectId}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as CommentDictModel;
        const error = response.error;

        if (!error) {
          this.comments = data;
          this.comments$.next(data);
        }

        return of({
          data: data,
          error,
        });
      }))
      ;
  };

  addComment = (expenseId: number, data: CommentModel): Observable<ApiResponseCommentModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/comment/${expenseId}`,
      method: 'POST',
      body: data,
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as CommentModel;
        const error = response.error;
        console.log('adding comments')
        if (!error) {
          this.comments[expenseId].push(data);
          this.comments$.next(this.comments);
        }

        return of({
          data: data,
          error,
        });
      })
    );
  };

  deleteComment = (expenseId: number, id: number): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/comment/${id}`,
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as CommentModel;
        const error = response.error;
        console.log('delete comments')

        if (!error) {
          this.comments[expenseId] = this.comments[expenseId].filter(comment => comment.id !== data.id);
          this.comments$.next(this.comments);
        }

        return of({
          data: data ? (data as CommentModel) : null,
          error,
        });
      })
    );
  };
}
