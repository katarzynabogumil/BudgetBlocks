import { Injectable } from '@angular/core';
import { mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseModel, ExpenseModel, RequestConfigModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  // TODO: behavioural subject!!!!!!

  constructor(public api: ApiService) {}

  getExpense = (id: number): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/expense/${id}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        const projectData = data ? (data as ExpenseModel) : null;

        return of({
          data: projectData,
          error,
        });
      }))
    ;
  };

  addExpense = (data: ExpenseModel): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/expense`,
      method: 'POST',
      body: data,
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        
        return of({
          data: data ? (data as ExpenseModel) : null,
          error,
        });
      })
    );
  };

  editExpense = (id: number, data: ExpenseModel): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/expense/${id}`,
      method: 'PUT',
      body: data,
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        
        return of({
          data: data ? (data as ExpenseModel) : null,
          error,
        });
      })
    );
  };

  deleteExpense = (id: number): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/expense/${id}`,
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        
        return of({
          data: data ? (data as ExpenseModel) : null,
          error,
        });
      })
    );
  };
}
