import { Injectable } from '@angular/core';
import { mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { RequestConfigModel, ApiResponseExpCategoryModel, ExpCategoryModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(
    private api: ApiService,
  ) { }

  public changeCatOrderId = (categoryId: number, newOrderId: number): Observable<ApiResponseExpCategoryModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/categories/${categoryId}/${newOrderId}`,
      method: 'PUT',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;

        return of({
          data: data ? data as ExpCategoryModel : null,
          error,
        });
      }))
      ;
  };
}
