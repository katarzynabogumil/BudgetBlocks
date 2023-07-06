import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseModel, ApiResponseCommentModel, CommentModel, CommentDictModel, RequestConfigModel, ApiResponseCommentDictModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comments: CommentDictModel = {};
  private _comments$ = new BehaviorSubject<CommentDictModel>({});

  constructor(
    private api: ApiService,
  ) { }

  public get comments$(): Observable<CommentDictModel> {
    return this._comments$.asObservable();
  }

  public getAllComments = (projectId: number): Observable<ApiResponseCommentDictModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/comments/${projectId}`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;

        if (!error) {
          this.comments = data as CommentDictModel;
          this._comments$.next(this.comments);
        }

        return of({
          data: data ? (data as CommentDictModel) : null,
          error,
        });
      }))
      ;
  };

  public addComment = (expenseId: number, data: CommentModel): Observable<ApiResponseCommentModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/comment/${expenseId}`,
      method: 'POST',
      body: data,
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;

        if (!error) {
          if (!this.comments[expenseId]) this.comments[expenseId] = [];
          this.comments[expenseId].push(data as CommentModel);
          this._comments$.next(this.comments);
        }

        return of({
          data: data ? (data as CommentModel) : null,
          error,
        });
      })
    );
  };

  public deleteComment = (expenseId: number, id: number): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/comment/${id}`,
      method: 'DELETE',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as CommentModel;
        const error = response.error;

        if (!error && this.comments[expenseId]) {
          this.comments[expenseId] = this.comments[expenseId].filter(comment => comment.id !== data.id);
          this._comments$.next(this.comments);
        }

        return of({
          data: data ? (data as CommentModel) : null,
          error,
        });
      })
    );
  };
}
