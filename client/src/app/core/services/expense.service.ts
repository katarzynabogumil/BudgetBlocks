import { Injectable } from '@angular/core';
import { BehaviorSubject, first, mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ExpenseModel, ApiResponseExpenseModel, RequestConfigModel, CreateExpenseModel } from '../models';
import { ApiService } from './api.service';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private _expenseSum$ = new BehaviorSubject<number>(0);
  private _expenseSumsByCat$ = new BehaviorSubject<{ [key: string]: number; }>({});
  private _minSum$ = new BehaviorSubject<number>(0);
  private _maxSum$ = new BehaviorSubject<number>(0);
  private _compareMode$ = new BehaviorSubject<boolean>(false);

  constructor(
    public api: ApiService,
    public projectApi: ProjectService,
  ) { }

  public get expenseSum$(): Observable<number> {
    return this._expenseSum$.asObservable();
  }

  public set expenseSum$(sum: Observable<number>) {
    sum.pipe(first()).subscribe(s => {
      this._expenseSum$.next(s);
    })
  }

  public get expenseSumsByCat$(): Observable<{ [key: string]: number; }> {
    return this._expenseSumsByCat$.asObservable();
  }

  public set expenseSumsByCat$(sums: Observable<{ [key: string]: number; }>) {
    sums.pipe(first()).subscribe(s => {
      this._expenseSumsByCat$.next(s);
    })
  }

  public get minSum$(): Observable<number> {
    return this._minSum$.asObservable();
  }

  public set minSum$(sum: Observable<number>) {
    sum.pipe(first()).subscribe(s => {
      this._minSum$.next(s);
    })
  }

  public get maxSum$(): Observable<number> {
    return this._maxSum$.asObservable();
  }

  public set maxSum$(sum: Observable<number>) {
    sum.pipe(first()).subscribe(s => {
      this._maxSum$.next(s);
    })
  }

  public get compareMode$(): Observable<boolean> {
    return this._compareMode$.asObservable();
  }

  public set compareMode$(sum: Observable<boolean>) {
    sum.pipe(first()).subscribe(c => {
      this._compareMode$.next(c);
    })
  }

  public getExpense = (projectId: number, id: number): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/expense/${id}`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ExpenseModel;
        const error = response.error;

        return of({
          data: data,
          error,
        });
      }))
      ;
  };

  public addExpense = (projectId: number, data: CreateExpenseModel): Observable<ApiResponseExpenseModel> => {
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
          this.projectApi.project$.pipe(first()).subscribe(project => {
            project.expenses.push(data);
            this.projectApi.project$ = of(project);
          });
        }

        return of({
          data: data,
          error,
        });
      }))
      ;
  }

  public editExpense = (projectId: number, id: number, data: CreateExpenseModel): Observable<ApiResponseExpenseModel> => {
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
          this.projectApi.project$.pipe(first()).subscribe(project => {
            project.expenses = project.expenses.map(expense => {
              if (expense.id === id) {
                expense = data;
              }
              return expense
            });
            this.projectApi.project$ = of(project);
          });
        }

        return of({
          data: data,
          error,
        });
      })
    );
  }

  public deleteExpense = (projectId: number, id: number): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/expense/${id}`,
      method: 'DELETE',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ExpenseModel;
        const error = response.error;

        this.projectApi.project$.pipe(first()).subscribe(project => {
          project.expenses = project.expenses.filter(expense => expense.id !== id);

          const deletedCategory = data.category;
          project.categories = project.categories?.filter(category => {
            return !((category.expenses?.length === 1) && category.category === deletedCategory.category)
          });

          this.projectApi.project$ = of(project);
        });

        return of({
          data: data,
          error,
        });
      }));
  }

  public vote = (direction: string, projectId: number, id: number): Observable<ApiResponseExpenseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/expense/${id}/${direction}`,
      method: 'PUT',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ExpenseModel;
        const error = response.error;

        this.projectApi.project$.pipe(first()).subscribe(project => {
          project.expenses = project.expenses.map(expense => {
            if (expense.id === id) {
              expense = data;
            }
            return expense
          });

          this.projectApi.project$ = of(project);
        });

        return of({
          data: data,
          error,
        });
      })
    );
  }
}