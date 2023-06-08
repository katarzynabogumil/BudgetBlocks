import { Injectable } from '@angular/core';
import { mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseModel, UserModel, RequestConfigModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userSub: string = '';

  constructor(public api: ApiService) {}

  getUser = (): Observable<ApiResponseModel> => {
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
        const userData = data ? (data as UserModel) : null;

        this.userSub = userData?.sub || '';

        return of({
          data: userData,
          error,
        });
      }))
    ;
  };

  saveUser = (userData: UserModel): Observable<ApiResponseModel> => {
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
          data: data ? (data as UserModel) : null,
          error,
        });
      })
    );
  };
}
