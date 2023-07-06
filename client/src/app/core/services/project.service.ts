import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, first, mergeMap, Observable, of } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { ApiResponseProjectModel, ApiResponseProjectModelArr, CreateProjectModel, EmptyProject, ProjectModel, RequestConfigModel } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: ProjectModel[] = [];
  private _projects$ = new BehaviorSubject<ProjectModel[]>([]);

  private _project$ = new BehaviorSubject<ProjectModel>(EmptyProject);
  private _projectInvitations$ = new BehaviorSubject<ProjectModel[]>([]);

  constructor(
    private api: ApiService,
    private router: Router,
  ) { }

  public get projects$(): Observable<ProjectModel[]> {
    return this._projects$.asObservable();
  }

  public get project$(): Observable<ProjectModel> {
    return this._project$.asObservable();
  }

  public set project$(project: Observable<ProjectModel>) {
    project.pipe(first()).subscribe(p => {
      this._project$.next(p);
    })
  }

  public get projectInvitations$(): Observable<ProjectModel[]> {
    return this._projectInvitations$.asObservable();
  }

  public getAllProjects = (): Observable<ApiResponseProjectModelArr> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/projects`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;

        if (error) this.router.navigate([`/`]);
        else {
          this.projects = data as ProjectModel[];
          this._projects$.next(this.projects);
        }

        return of({
          data: data ? data as ProjectModel[] : null,
          error,
        });
      })
    );
  };

  public getProject = (id: number): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${id}`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;

        if (error) this.router.navigate([`projects/`]);
        else {
          this._project$.next(data as ProjectModel);
        }

        return of({
          data: data ? data as ProjectModel : null,
          error,
        });
      })
    );
  };

  public addProject = (projectData: CreateProjectModel): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project`,
      method: 'POST',
      body: projectData,
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;

        if (!error) {
          this.projects.push(data as ProjectModel);
          this._projects$.next(this.projects);
        }

        return of({
          data: data ? data as ProjectModel : null,
          error,
        });
      })
    );
  }

  public editProject = (id: number, projectData: CreateProjectModel): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${id}`,
      method: 'PUT',
      body: projectData,
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;

        if (!error) {
          this.projects = this.projects.map(project => {
            if (project.id === id) project = data as ProjectModel;
            return project;
          });
          this._projects$.next(this.projects);
        }

        return of({
          data: data ? data as ProjectModel : null,
          error,
        });
      })
    );
  }

  public deleteProject = (id: number): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${id}`,
      method: 'DELETE',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;

        if (!error) {
          this.projects = this.projects.filter(project => project.id !== id);
          this._projects$.next(this.projects);
        }

        return of({
          data: data ? data as ProjectModel : null,
          error,
        });
      })
    );
  }

  public getProjectInvitations = (): Observable<ApiResponseProjectModelArr> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/projects/invitations`,
      method: 'GET',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;

        if (error) this.router.navigate([`/`]);
        else this._projectInvitations$.next(data as ProjectModel[]);

        return of({
          data: data ? data as ProjectModel[] : null,
          error,
        });
      })
    );
  };

  public acceptInvitation = (projectId: number): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/accept`,
      method: 'PUT',
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;

        if (error) this.router.navigate([`project/${projectId}`]);
        else {
          this.projects.push(data as ProjectModel);
          this._projects$.next(this.projects);
        }

        return of({
          data: data ? data as ProjectModel : null,
          error,
        });
      })
    );
  }

  public addUser = (email: string, projectId: number): Observable<ApiResponseProjectModel> => {
    const config: RequestConfigModel = {
      url: `${env.api.serverUrl}/project/${projectId}/adduser`,
      method: 'POST',
      body: { email },
      ...this.api.headers
    };

    return this.api.callApi(config).pipe(
      mergeMap((response) => {
        const { data, error } = response;

        if (error) this.router.navigate([`project/${projectId}`]);
        else {
          this.projects = this.projects.map(project => {
            if (project.id === projectId) project = data as ProjectModel;
            return project;
          });
          this._projects$.next(this.projects);
        }

        return of({
          data: data ? data as ProjectModel : null,
          error,
        });
      })
    );
  }

}
