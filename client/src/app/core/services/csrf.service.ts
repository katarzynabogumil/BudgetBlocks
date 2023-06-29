import { Injectable } from '@angular/core';
import { mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { RequestConfigModel, ApiResponseTokenModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {

  constructor(public api: ApiService) { }

  getToken = (): Observable<ApiResponseTokenModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/csrf-token`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        return of({
          data: data as { csrfToken: string },
          error,
        });
      }))
      ;
  };
}
