import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseModel, RequestConfigModel, EmptyCurrencyRates, CurrencyRatesModel, RatingModel, ApiResponseRatingModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  rating$ = new BehaviorSubject<RatingModel>({ rating: 0 });
  missingCategories$ = new BehaviorSubject<{ [key: number]: string }>({});
  missingCategories: { [key: number]: string } = {};

  constructor(
    public api: ApiService
  ) { }

  getRating = (projectId: number): Observable<ApiResponseRatingModel> => {
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
          this.rating$.next(data);
        }

        return of({
          data: data,
          error,
        });
      }));
  };

  getMissingCategories = (projectId: number): Observable<ApiResponseModel> => {
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
          this.missingCategories[projectId] = data.categories;
          this.missingCategories$.next(this.missingCategories);
        }

        return of({
          data: data,
          error,
        });
      }));
  };
}
