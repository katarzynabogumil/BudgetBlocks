import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseProjectModel, ApiResponseProjectModelArr, CreateProjectModel, EmptyProject, ProjectModel, RequestConfigModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: ProjectModel[] = [];
  projects$ = new BehaviorSubject<ProjectModel[]>([]);

  projectInvitations$ = new BehaviorSubject<ProjectModel[]>([]);

  project$ = new BehaviorSubject<ProjectModel>(EmptyProject);

  constructor(
    public api: ApiService,
    private router: Router,
  ) { }

  getProjectInvitations = (): Observable<ApiResponseProjectModelArr> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/projects/invitations`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ProjectModel[];
        const error = response.error;

        if (error) this.router.navigate([`/`]);
        else this.projectInvitations$.next(data);

        return of({
          data: data,
          error,
        });
      }))
      ;
  };

  getAllProjects = (): Observable<ApiResponseProjectModelArr> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/projects`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ProjectModel[];
        const error = response.error;

        if (error) this.router.navigate([`/`]);
        else {
          this.projects = data;
          this.projects$.next(this.projects);
        }

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
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ProjectModel;
        const error = response.error;

        if (error) this.router.navigate([`projects/`]);
        else {
          this.project$.next(data);
        }

        return of({
          data: data,
          error,
        });
      }))
      ;
  };

  addProject = (projectData: CreateProjectModel): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project`,
      method: 'POST',
      body: projectData,
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ProjectModel;
        const error = response.error;

        if (!error) {
          this.projects.push(data);
          this.projects$.next(this.projects);
        }

        return of({
          data: data,
          error,
        });
      }))
      ;
  }

  editProject = (id: number, projectData: CreateProjectModel): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${id}`,
      method: 'PUT',
      body: projectData,
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ProjectModel;
        const error = response.error;

        if (!error) {
          this.projects = this.projects.map(project => {
            if (project.id === id) project = data;
            return project;
          });
          this.projects$.next(this.projects);
        }

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
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ProjectModel;
        const error = response.error;

        if (!error) {
          this.projects = this.projects.filter(project => project.id !== id);
          this.projects$.next(this.projects);
        }

        return of({
          data: data,
          error,
        });
      }))
      ;
  }

  acceptInvitation = (projectId: number): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/accept`,
      method: 'PUT',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ProjectModel;
        const error = response.error;

        if (error) this.router.navigate([`project/${projectId}`]);
        else {
          this.projects.push(data);
          this.projects$.next(this.projects);
        }

        return of({
          data: data,
          error,
        });
      }))
      ;
  }

  addUser = (email: string, projectId: number): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/adduser`,
      method: 'POST',
      body: { email },
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const data = response.data as ProjectModel;
        const error = response.error;

        if (error) this.router.navigate([`project/${projectId}`]);
        else {
          this.projects.push(data);
          this.projects$.next(this.projects);
        }

        return of({
          data: data,
          error,
        });
      }))
      ;
  }


}
