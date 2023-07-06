import { Injectable } from '@angular/core';
import { mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseUserModel, UserModel, RequestConfigModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSub = '';

  constructor(public api: ApiService) { }

  public getCurrentUserSub = (): string => {
    return this.userSub;
  }

  public setCurrentUserSub = (sub: string): void => {
    this.userSub = sub;
  }

  public getUser = (): Observable<ApiResponseUserModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/user`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        return of({
          data: data as UserModel,
          error,
        });
      }))
      ;
  };

  public saveUser = (userData: UserModel): Observable<ApiResponseUserModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/user`,
      method: 'POST',
      body: userData,
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        return of({
          data: data as UserModel,
          error,
        });
      })
    );
  };
}
