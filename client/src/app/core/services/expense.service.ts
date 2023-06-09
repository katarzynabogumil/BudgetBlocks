import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseModel, ExpenseModel, ApiResponseExpenseModel, RequestConfigModel, EmptyExpense } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  expenses$ = new BehaviorSubject<ExpenseModel[]>([]);
  private expenses: ExpenseModel[] = [];

  expense$ = new BehaviorSubject<ExpenseModel>(EmptyExpense);

  constructor(public api: ApiService) {}

  getExpense = (id: number): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/expense/${id}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ExpenseModel;
        const error = response.error;

        this.expense$.next(data);        
        return of({
          data: data,
          error,
        });
      }))
    ;
  };

  addExpense = (projectId: number, data: ExpenseModel): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/expense`,
      method: 'POST',
      body: data,
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ExpenseModel;
        const error = response.error;
        this.expenses.push(data);
        this.expenses$.next(this.expenses);

        return of({
          data: data,
          error,
        });
      }))
    ;
  }

  editExpense = (id: number, data: ExpenseModel): Observable<ApiResponseExpenseModel> => {
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
        const data = response.data as ExpenseModel;
        const error = response.error;
        this.expenses = this.expenses.map(expense => {
          if (expense.id === id) expense = data;
          return expense;
        });
        this.expenses$.next(this.expenses);
        return of({
          data: data,
          error,
        });
      }))
    ;
  }
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
        const data = response.data as ExpenseModel;
        const error = response.error;
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.expenses$.next(this.expenses);
        return of({
          data: data,
          error,
        });
      }))
    ;
  }
}
