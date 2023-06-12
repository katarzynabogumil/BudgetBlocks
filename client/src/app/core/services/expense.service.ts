import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseModel, ExpenseModel, ProjectModel, ApiResponseExpenseModel, RequestConfigModel, EmptyExpense } from '../models';
import { ApiService } from './api.service';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  expense$ = new BehaviorSubject<ExpenseModel>(EmptyExpense);
  // expenses$ = new BehaviorSubject<ExpenseModel[]>([]);
  // private expenses: ExpenseModel[] = [];

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

        // this.expenses.push(data);
        // this.expenses$.next(this.expenses);

        const project = this.projectApi.project$.getValue();
        project.expenses.push(data);
        this.projectApi.project$.next(project);

        return of({
          data: data,
          error,
        });
      }))
      ;
  }

  editExpense = (projectId: number, id: number, data: ExpenseModel): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/expense/${id}`,
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

        // this.expenses = this.expenses.map(expense => {
        //   if (expense.id === id) expense = data;
        //   return expense;
        // });
        // this.expenses$.next(this.expenses);

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

  deleteExpense = (projectId: number, id: number): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/expense/${id}`,
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
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
      headers: {
        'content-type': 'application/json',
      },
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