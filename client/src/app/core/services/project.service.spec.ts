import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { ProjectService } from './project.service';
import { environment as env } from '../../../environments/environment';
import { ProjectMock } from '../mocks';
import { BehaviorSubject } from 'rxjs';
import { EmptyProject, ProjectModel } from '../models';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpController: HttpTestingController;
  let projects: ProjectModel[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        ApiService,
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });

    service = TestBed.inject(ProjectService);

    projects = [];
    service.projects$ = new BehaviorSubject<ProjectModel[]>(projects);
    service.projects = projects;
    service.projectInvitations$ = new BehaviorSubject<ProjectModel[]>(projects);
    service.project$ = new BehaviorSubject<ProjectModel>(EmptyProject);

    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getProjectInvitations and return project array', () => {
    service.getProjectInvitations().subscribe((res) => {
      expect(res.data).toEqual(projects);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${env.api.serverUrl}/projects/invitations`,
    });

    req.flush(projects);
  });

  it('should call getAllProjects and return project array', () => {
    service.getAllProjects().subscribe((res) => {
      expect(res.data).toEqual(projects);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${env.api.serverUrl}/projects`,
    });

    req.flush(projects);
  });

  it('should call getProject and return a project', () => {
    const id = 1;
    service.getProject(id).subscribe((res) => {
      expect(res.data).toEqual(ProjectMock);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${env.api.serverUrl}/project/${id}`,
    });

    req.flush(ProjectMock);
  });

  it('should call addProject and return new project', () => {
    service.addProject(ProjectMock).subscribe((res) => {
      expect(res.data).toEqual(ProjectMock);
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${env.api.serverUrl}/project`,
    });

    req.flush(ProjectMock);
  });

  it('should call editProject and return updated project', () => {
    const id = 1;
    service.editProject(id, ProjectMock).subscribe((res) => {
      expect(res.data).toEqual(ProjectMock);
    });

    const req = httpController.expectOne({
      method: 'PUT',
      url: `${env.api.serverUrl}/project/${id}`,
    });

    req.flush(ProjectMock);
  });

  it('should call deleteProject and return deleted project', () => {
    const id = 1;
    service.deleteProject(id).subscribe((res) => {
      expect(res.data).toEqual(ProjectMock);
    });

    const req = httpController.expectOne({
      method: 'DELETE',
      url: `${env.api.serverUrl}/project/${id}`,
    });

    req.flush(ProjectMock);
  });
});