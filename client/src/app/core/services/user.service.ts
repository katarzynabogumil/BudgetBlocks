import { Injectable } from '@angular/core';
import { mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseUserModel, UserModel, RequestConfigModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userSub: string = '';

  constructor(public api: ApiService) {}

  getUser = (): Observable<ApiResponseUserModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/user`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
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

  saveUser = (userData: UserModel): Observable<ApiResponseUserModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/user`,
      method: 'POST',
      body: userData,
      headers: {
        'content-type': 'application/json',
      },
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
