import { Injectable } from '@angular/core';
import { mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseModel, ProjectModel, RequestConfigModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  // TODO: behavioural subject!!!!!!

  constructor(public api: ApiService) {}

  getAllProjects = (): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/projects`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        const projectData = data ? (data as ProjectModel[]) : null;

        return of({
          data: projectData,
          error,
        });
      }))
    ;
  };

  getProject = (id: number): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${id}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        const projectData = data ? (data as ProjectModel) : null;

        return of({
          data: projectData,
          error,
        });
      }))
    ;
  };

  addProject = (projectData: ProjectModel): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project`,
      method: 'POST',
      body: projectData,
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        
        return of({
          data: data ? (data as ProjectModel) : null,
          error,
        });
      })
    );
  };

  editProject = (id: number, projectData: ProjectModel): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${id}`,
      method: 'PUT',
      body: projectData,
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        
        return of({
          data: data ? (data as ProjectModel) : null,
          error,
        });
      })
    );
  };

  deleteProject = (id: number): Observable<ApiResponseModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${id}`,
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;
        
        return of({
          data: data ? (data as ProjectModel) : null,
          error,
        });
      })
    );
  };
}
