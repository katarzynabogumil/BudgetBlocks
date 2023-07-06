import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { ExpenseService } from './expense.service';
import { ExpenseMock, ProjectMock } from '../mocks';
import { first, of } from 'rxjs';
import { ProjectService } from './project.service';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let projectService: ProjectService;
  let callApiSpy: jasmine.Spy;
  let projectSpy: jasmine.Spy;
  let error: { message: string };
  const initialSum = 0;
  const initialSumDict = {};
  const initialMode = false;
  const id = 1;
  const Cat = 'Flights';
  const sumDictMock = { 'Flights': 100 };

  beforeEach(() => {
    const mockApiService = jasmine.createSpyObj<ApiService>(
      'ApiService',
      ['callApi']
    );

    error = { message: 'Error' };
    callApiSpy = mockApiService.callApi.and.returnValue(
      of({ data: null, error: error })
    );

    const mockProjectService = jasmine.createSpyObj<ProjectService>(
      'ProjectService',
      ['project$']
    );

    // projectSpy = spyOnProperty(
    //   mockProjectService,
    //   'project$',
    //   'get'
    // ).and.returnValue(of(ProjectMock));

    // const moduleSpecServiceMock = {
    //   ...jasmine.createSpyObj('moduleSpecServiceMock ', ['']),
    //   activePropertyChanged: of()
    // } as jasmine.SpyObj;

    TestBed.configureTestingModule({
      providers: [
        ExpenseService,
        { provide: ApiService, useValue: mockApiService },
        { provide: ProjectService, useValue: mockProjectService },
      ],
    });

    service = TestBed.inject(ExpenseService);
    projectService = TestBed.inject(ProjectService);
  });


  describe('initial', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });


    it('should get expense sum', () => {
      service.expenseSum$.pipe(first()).subscribe(s => {
        expect(s).toEqual(initialSum);
      });
    });

    it('should successfully set expense sum', () => {
      const sum = 2;
      service.expenseSum$ = of(sum);
      service.expenseSum$.pipe(first()).subscribe(s => {
        expect(s).toEqual(sum);
      });
    });


    it('should get min sum', () => {
      service.minSum$.pipe(first()).subscribe(s => {
        expect(s).toEqual(initialSum);
      });
    });

    it('should successfully set min sum', () => {
      const sum = 2;
      service.minSum$ = of(sum);
      service.minSum$.pipe(first()).subscribe(s => {
        expect(s).toEqual(sum);
      });
    });


    it('should get max sum', () => {
      service.maxSum$.pipe(first()).subscribe(s => {
        expect(s).toEqual(initialSum);
      });
    });

    it('should successfully set max sum', () => {
      const sum = 2;
      service.maxSum$ = of(sum);
      service.maxSum$.pipe(first()).subscribe(s => {
        expect(s).toEqual(sum);
      });
    });


    it('should get sums by categories', () => {
      service.expenseSumsByCat$.pipe(first()).subscribe(s => {
        expect(s).toEqual(initialSumDict);
      });
    });

    it('should successfully set sums by categories', () => {
      service.expenseSumsByCat$ = of(sumDictMock);
      service.expenseSumsByCat$.pipe(first()).subscribe(s => {
        expect(s).toEqual(sumDictMock);
      });
    });
  });


  describe('getExpense', () => {
    it('should call getExpense and return expense data', () => {
      callApiSpy.and.returnValue(of({ data: ExpenseMock, error: null }));

      service.getExpense(id, id).subscribe((res) => {
        expect(res.data).toEqual(ExpenseMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });

    it('should call getExpense and return error if error', () => {
      service.getExpense(id, id).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });
  });


  describe('addExpense', () => {
    beforeEach(() => {
      projectService.project$ = of(ProjectMock);
    });

    it('should call addExpense, update comments$ and return new commnet', () => {
      callApiSpy.and.returnValue(
        of({ data: ExpenseMock, error: null })
      );

      service.addExpense(id, ExpenseMock).subscribe((res) => {
        expect(res.data).toEqual(ExpenseMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        projectService.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual({
            ...ProjectMock,
            expenses: [ExpenseMock]
          });
        });
      });
    });

    it('should call addExpense, not update comments$ and return error if error', () => {
      service.addExpense(id, ExpenseMock).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        projectService.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual(ProjectMock);
        });
      });
    });
  });


  // describe('editProject', () => {
  //   beforeEach(() => {
  //     callApiSpy.and.returnValue(
  //       of({ data: ProjectMock, error: null })
  //     );
  //     service.addProject(ProjectMock).pipe(first()).subscribe();
  //   });

  //   it('should call editProject, update projects$ and return project data', () => {
  //     const id = ProjectMock.id;
  //     const newName = 'New name';
  //     const changedMock = { ...ProjectMock, name: newName }
  //     callApiSpy.and.returnValue(
  //       of({ data: changedMock, error: null })
  //     );

  //     service.projects$.pipe(first()).subscribe(p => {
  //       expect(p).toEqual([ProjectMock]);
  //     });

  //     service.editProject(id, changedMock).subscribe((res) => {
  //       expect(res.data).toEqual(changedMock);
  //       expect(res.error).toEqual(null);
  //       expect(callApiSpy).toHaveBeenCalled();

  //       service.projects$.pipe(first()).subscribe(p => {
  //         expect(p).toEqual([changedMock]);
  //       });
  //     });
  //   });

  //   it('should call editProject, not update projects$ and return error if error', () => {
  //     const id = ProjectMock.id;
  //     callApiSpy.and.returnValue(
  //       of({ data: null, error })
  //     );

  //     service.projects$.pipe(first()).subscribe(p => {
  //       expect(p).toEqual([ProjectMock]);
  //     });

  //     service.editProject(id, ProjectMock).subscribe((res) => {
  //       expect(res.data).toEqual(null);
  //       expect(res.error).toEqual(error);
  //       expect(callApiSpy).toHaveBeenCalled();

  //       service.projects$.pipe(first()).subscribe(p => {
  //         expect(p).toEqual([ProjectMock]);
  //       });
  //     });
  //   });
  // });


  // describe('deleteProject', () => {
  //   beforeEach(() => {
  //     callApiSpy.and.returnValue(
  //       of({ data: ProjectMock, error: null })
  //     );
  //     service.addProject(ProjectMock).pipe(first()).subscribe();
  //   });

  //   it('should call deleteProject, update projects$ and return project data', () => {
  //     const id = ProjectMock.id;
  //     callApiSpy.and.returnValue(
  //       of({ data: ProjectMock, error: null })
  //     );

  //     service.projects$.pipe(first()).subscribe(p => {
  //       expect(p).toEqual([ProjectMock]);
  //     });

  //     service.deleteProject(id).subscribe((res) => {
  //       expect(res.data).toEqual(ProjectMock);
  //       expect(res.error).toEqual(null);
  //       expect(callApiSpy).toHaveBeenCalled();

  //       service.projects$.pipe(first()).subscribe(p => {
  //         expect(p).toEqual([]);
  //       });
  //     });
  //   });

  //   it('should call deleteProject, not update projects$ and return error if error', () => {
  //     const id = ProjectMock.id;
  //     callApiSpy.and.returnValue(
  //       of({ data: null, error })
  //     );

  //     service.projects$.pipe(first()).subscribe(p => {
  //       expect(p).toEqual([ProjectMock]);
  //     });

  //     service.deleteProject(id).subscribe((res) => {
  //       expect(res.data).toEqual(null);
  //       expect(res.error).toEqual(error);
  //       expect(callApiSpy).toHaveBeenCalled();

  //       service.projects$.pipe(first()).subscribe(p => {
  //         expect(p).toEqual([ProjectMock]);
  //       });
  //     });
  //   });
  // });


  // VOTE

});