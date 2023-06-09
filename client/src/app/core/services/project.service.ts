import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseProjectModel, ApiResponseProjectModelArr, EmptyProject, ProjectModel, RequestConfigModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projects$ = new BehaviorSubject<ProjectModel[]>([]);
  private projects: ProjectModel[] = [];

  project$ = new BehaviorSubject<ProjectModel>(EmptyProject);

  constructor(public api: ApiService) {}

  getAllProjects = (): Observable<ApiResponseProjectModelArr> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/projects`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ProjectModel[];
        const error = response.error;

        this.projects = data;
        this.projects$.next(this.projects);
        
        return of({
          data: data,
          error,
        });
      }))
    ;
  };

  getProject = (id: number): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${id}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ProjectModel;
        const error = response.error;

        this.project$.next(data);
                return of({
          data: data,
          error,
        });
      }))
    ;
  };

  addProject = (projectData: ProjectModel): Observable<ApiResponseProjectModel> => {
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
        const data = response.data as ProjectModel;
        const error = response.error;
        this.projects.push(data);
        this.projects$.next(this.projects);

        return of({
          data: data,
          error,
        });
      }))
    ;
  }

  editProject = (id: number, projectData: ProjectModel): Observable<ApiResponseProjectModel> => {
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
        const data = response.data as ProjectModel;
        const error = response.error;
        this.projects = this.projects.map(project => {
          if (project.id === id) project = data;
          return project;
        });
        this.projects$.next(this.projects);
        return of({
          data: data,
          error,
        });
      }))
    ;
  }

  deleteProject = (id: number): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${id}`,
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ProjectModel;
        const error = response.error;
        this.projects = this.projects.filter(project => project.id !== id);
        this.projects$.next(this.projects);
        return of({
          data: data,
          error,
        });
      }))
    ;
  }
}
