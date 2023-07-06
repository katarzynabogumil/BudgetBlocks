import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseModel, RequestConfigModel, RatingModel, ApiResponseRatingModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private _rating$ = new BehaviorSubject<RatingModel>({ rating: 0 });
  private _missingCategories: { [key: number]: string } = {};
  private _missingCategories$ = new BehaviorSubject<{ [key: number]: string }>({});

  constructor(
    private api: ApiService
  ) { }

  public get rating$(): Observable<RatingModel> {
    return this._rating$.asObservable();
  }

  public get missingCategories$(): Observable<{ [key: number]: string }> {
    return this._missingCategories$.asObservable();
  }

  public getRating = (projectId: number): Observable<ApiResponseRatingModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/rating/${projectId}`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as RatingModel;
        const error = response.error;

        if (!error) {
          this._rating$.next(data);
        }

        return of({
          data: data,
          error,
        });
      }));
  };

  public getMissingCategories = (projectId: number): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/missing-categories/${projectId}`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as { categories: string };
        const error = response.error;

        if (!error) {
          this._missingCategories[projectId] = data.categories;
          this._missingCategories$.next(this._missingCategories);
        }

        return of({
          data: data,
          error,
        });
      }));
  };
}
