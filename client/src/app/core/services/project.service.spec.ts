import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { ProjectService } from './project.service';
import { ProjectMock, UserMock } from '../mocks';
import { first, of } from 'rxjs';
import { EmptyProject, ProjectModel } from '../models';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('ProjectService', () => {
  let service: ProjectService;
  let callApiSpy: jasmine.Spy;
  let routerSpy: jasmine.SpyObj<Router>;
  let error: { message: string };
  const initalProjects: ProjectModel[] = [];
  const initalProjectInvitations: ProjectModel[] = [];
  const initalProject: ProjectModel = EmptyProject;

  beforeEach(() => {
    const mockApiService = jasmine.createSpyObj<ApiService>(
      'ApiService',
      ['callApi']
    );

    error = { message: 'Error' };
    callApiSpy = mockApiService.callApi.and.returnValue(
      of({ data: null, error: error })
    );

    routerSpy = jasmine.createSpyObj<Router>(
      'Router',
      ['navigate']
    );

    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: routerSpy }
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: '/projects' }
        ])
      ]
    });

    service = TestBed.inject(ProjectService);
  });

  describe('initial', () => {

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get projects', () => {
      service.projects$.pipe(first()).subscribe(projects => {
        expect(projects).toEqual(initalProjects);
      });
    });

    it('should get project invitations', () => {
      service.projects$.pipe(first()).subscribe(projects => {
        expect(projects).toEqual(initalProjectInvitations);
      });
    });

    it('should get project', () => {
      service.project$.pipe(first()).subscribe(project => {
        expect(project).toEqual(initalProject);
      });
    });

    it('should successfully set project', () => {
      service.project$ = of(ProjectMock);
      service.project$.pipe(first()).subscribe(project => {
        expect(project).toEqual(ProjectMock);
      });
    });
  });


  describe('getAllProjects', () => {
    it('should call getAllProjects, update projects$ and return projects data', () => {
      callApiSpy.and.returnValue(
        of({ data: [ProjectMock], error: null })
      );

      service.getAllProjects().subscribe((res) => {
        expect(res.data).toEqual([ProjectMock]);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(projects => {
          expect(projects).toEqual([ProjectMock]);
        });
      });
    });

    it('should call getAllProjects, not update projects$ and return error if error', () => {
      service.getAllProjects().subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(projects => {
          expect(projects).toEqual(initalProjects);
        });
      });
    });
  });


  describe('getProject', () => {
    it('should call getProject, update project$ and return project data', () => {
      const id = 1;
      callApiSpy.and.returnValue(
        of({ data: ProjectMock, error: null })
      );

      service.getProject(id).subscribe((res) => {
        expect(res.data).toEqual(ProjectMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual(ProjectMock);
        });
      });
    });

    it('should call getProject, not update project$ and return error if error', () => {
      const id = 1;

      service.getProject(id).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual(initalProject);
        });

        const expectedPath = 'projects/';
        const [actualPath] =
          routerSpy.navigate.calls.first().args[0];
        expect(actualPath).toEqual(expectedPath);
      });
    });
  });


  describe('addProject', () => {
    it('should call addProject, update projects$ and return project data', () => {
      callApiSpy.and.returnValue(
        of({ data: ProjectMock, error: null })
      );

      service.addProject(ProjectMock).subscribe((res) => {
        expect(res.data).toEqual(ProjectMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(p => {
          expect(p).toEqual([ProjectMock]);
        });
      });
    });

    it('should call addProject, not update projects$ and return error if error', () => {
      service.addProject(ProjectMock).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(p => {
          expect(p).toEqual(initalProjects);
        });
      });
    });
  });


  describe('editProject', () => {
    beforeEach(() => {
      callApiSpy.and.returnValue(
        of({ data: ProjectMock, error: null })
      );
      service.addProject(ProjectMock).pipe(first()).subscribe();
    });

    it('should call editProject, update projects$ and return project data', () => {
      const id = ProjectMock.id;
      const newName = 'New name';
      const changedMock = { ...ProjectMock, name: newName }
      callApiSpy.and.returnValue(
        of({ data: changedMock, error: null })
      );

      service.projects$.pipe(first()).subscribe(p => {
        expect(p).toEqual([ProjectMock]);
      });

      service.editProject(id, changedMock).subscribe((res) => {
        expect(res.data).toEqual(changedMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(p => {
          expect(p).toEqual([changedMock]);
        });
      });
    });

    it('should call editProject, not update projects$ and return error if error', () => {
      const id = ProjectMock.id;
      callApiSpy.and.returnValue(
        of({ data: null, error })
      );

      service.projects$.pipe(first()).subscribe(p => {
        expect(p).toEqual([ProjectMock]);
      });

      service.editProject(id, ProjectMock).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(p => {
          expect(p).toEqual([ProjectMock]);
        });
      });
    });
  });


  describe('deleteProject', () => {
    beforeEach(() => {
      callApiSpy.and.returnValue(
        of({ data: ProjectMock, error: null })
      );
      service.addProject(ProjectMock).pipe(first()).subscribe();
    });

    it('should call deleteProject, update projects$ and return project data', () => {
      const id = ProjectMock.id;
      callApiSpy.and.returnValue(
        of({ data: ProjectMock, error: null })
      );

      service.projects$.pipe(first()).subscribe(p => {
        expect(p).toEqual([ProjectMock]);
      });

      service.deleteProject(id).subscribe((res) => {
        expect(res.data).toEqual(ProjectMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(p => {
          expect(p).toEqual([]);
        });
      });
    });

    it('should call deleteProject, not update projects$ and return error if error', () => {
      const id = ProjectMock.id;
      callApiSpy.and.returnValue(
        of({ data: null, error })
      );

      service.projects$.pipe(first()).subscribe(p => {
        expect(p).toEqual([ProjectMock]);
      });

      service.deleteProject(id).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(p => {
          expect(p).toEqual([ProjectMock]);
        });
      });
    });
  });


  describe('getProjectInvitations', () => {
    it('should call getProjectInvitations, update projectInvitations$ and return projects data', () => {
      callApiSpy.and.returnValue(
        of({ data: [ProjectMock], error: null })
      );

      service.getProjectInvitations().subscribe((res) => {
        expect(res.data).toEqual([ProjectMock]);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.projectInvitations$.pipe(first()).subscribe(projects => {
          expect(projects).toEqual([ProjectMock]);
        });
      });
    });

    it('should call getProjectInvitations, not update projectInvitations$ and return error if error', () => {
      service.getProjectInvitations().subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.projectInvitations$.pipe(first()).subscribe(projects => {
          expect(projects).toEqual(initalProjectInvitations);
        });
      });
    });
  });


  describe('addUser', () => {
    beforeEach(() => {
      callApiSpy.and.returnValue(
        of({ data: ProjectMock, error: null })
      );
      service.addProject(ProjectMock).pipe(first()).subscribe();
    });

    it('should call addUser, update projects$ and return project data', () => {
      const id = ProjectMock.id;
      const changedMock = { ...ProjectMock, invitedUsers: [UserMock] }
      callApiSpy.and.returnValue(
        of({ data: changedMock, error: null })
      );

      service.projects$.pipe(first()).subscribe(p => {
        expect(p).toEqual([ProjectMock]);
      });

      service.addUser(UserMock.email, id).subscribe((res) => {
        expect(res.data).toEqual(changedMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(p => {
          expect(p).toEqual([changedMock]);
        });
      });
    });

    it('should call addUser, not update projects$ and return error if error', () => {
      const id = ProjectMock.id;
      callApiSpy.and.returnValue(
        of({ data: null, error })
      );

      service.projects$.pipe(first()).subscribe(p => {
        expect(p).toEqual([ProjectMock]);
      });

      service.addUser(UserMock.email, id).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(p => {
          expect(p).toEqual([ProjectMock]);
        });
      });
    });
  });


  describe('acceptInvitation', () => {
    it('should call acceptInvitation, update projects$ and return project data', () => {
      const id = ProjectMock.id;
      callApiSpy.and.returnValue(
        of({ data: ProjectMock, error: null })
      );

      service.acceptInvitation(id).subscribe((res) => {
        expect(res.data).toEqual(ProjectMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(p => {
          expect(p).toEqual([ProjectMock]);
        });
      });
    });

    it('should call acceptInvitation, not update projects$ and return error if error', () => {
      const id = ProjectMock.id;
      service.acceptInvitation(id).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.projects$.pipe(first()).subscribe(p => {
          expect(p).toEqual(initalProjects);
        });
      });
    });
  });
});