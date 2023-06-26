import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseModel, ExpenseModel, ProjectModel, ApiResponseExpenseModel, RequestConfigModel, EmptyExpense, CreateExpenseModel } from '../models';
import { ApiService } from './api.service';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  expense$ = new BehaviorSubject<ExpenseModel>(EmptyExpense);
  expenseSum$ = new BehaviorSubject<number>(0);
  expenseSumsByCat$ = new BehaviorSubject<{ [key: string]: number; }>({});
  minSum$ = new BehaviorSubject<number>(0);
  maxSum$ = new BehaviorSubject<number>(0);
  compareMode$ = new BehaviorSubject<boolean>(false);

  constructor(
    public api: ApiService,
    public projectApi: ProjectService,
  ) { }

  getExpense = (projectId: number, id: number): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/expense/${id}`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ExpenseModel;
        const error = response.error;

        if (!error) this.expense$.next(data);

        return of({
          data: data,
          error,
        });
      }))
      ;
  };

  addExpense = (projectId: number, data: CreateExpenseModel): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/expense`,
      method: 'POST',
      body: data,
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ExpenseModel;
        const error = response.error;

        if (!error) {
          const project = this.projectApi.project$.getValue();
          project.expenses.push(data);
          this.projectApi.project$.next(project);
        }

        return of({
          data: data,
          error,
        });
      }))
      ;
  }

  editExpense = (projectId: number, id: number, data: CreateExpenseModel): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/expense/${id}`,
      method: 'PUT',
      body: data,
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ExpenseModel;
        const error = response.error;

        if (!error) {
          const project = this.projectApi.project$.getValue();
          project.expenses = project.expenses.map(expense => {
            if (expense.id === id) {
              expense = data;
            }
            return expense
          });
          this.projectApi.project$.next(project);
        }

        return of({
          data: data,
          error,
        });
      })
    );
  }

  deleteExpense = (projectId: number, id: number): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/expense/${id}`,
      method: 'DELETE',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ExpenseModel;
        const error = response.error;

        const project = this.projectApi.project$.getValue();
        project.expenses = project.expenses.filter(expense => expense.id !== id);

        const deletedCategory = data.category;
        project.categories = project.categories?.filter(category => {
          return !((category.expenses?.length === 1) && category.category === deletedCategory.category)
        });

        this.projectApi.project$.next(project);

        return of({
          data: data,
          error,
        });
      }));
  }

  vote = (direction: string, projectId: number, id: number): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/expense/${id}/${direction}`,
      method: 'PUT',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ExpenseModel;
        const error = response.error;

        const project = this.projectApi.project$.getValue();

        project.expenses = project.expenses.map(expense => {
          if (expense.id === id) {
            expense = data;
          }
          return expense
        });
        this.projectApi.project$.next(project);

        return of({
          data: data,
          error,
        });
      })
    );
  }
}