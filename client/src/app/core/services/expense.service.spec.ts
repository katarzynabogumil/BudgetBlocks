import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { ExpenseService } from './expense.service';
import { ExpenseMock, ProjectMock, UserMock } from '../mocks';
import { first, of } from 'rxjs';
import { ProjectService } from './project.service';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let mockProjectService: jasmine.SpyObj<ProjectService>;
  let callApiSpy: jasmine.Spy;
  let error: { message: string };
  const initialSum = 0;
  const initialSumDict = {};
  const initialMode = false;
  const id = 1;
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

    mockProjectService = jasmine.createSpyObj<ProjectService>(
      'ProjectService',
      ['project$']
    );
    ProjectMock.expenses = [];
    mockProjectService.project$ = of(ProjectMock);

    TestBed.configureTestingModule({
      providers: [
        ExpenseService,
        { provide: ApiService, useValue: mockApiService },
        { provide: ProjectService, useValue: mockProjectService },
      ],
    });

    service = TestBed.inject(ExpenseService);
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


    it('should get compare mode', () => {
      service.compareMode$.pipe(first()).subscribe(s => {
        expect(s).toEqual(initialMode);
      });
    });

    it('should successfully compare mode', () => {
      service.compareMode$ = of(true);
      service.compareMode$.pipe(first()).subscribe(s => {
        expect(s).toEqual(true);
      });
    });
  });


  describe('getExpense', () => {
    it('should call getExpense and return expense data', () => {
      callApiSpy.and.returnValue(of({ data: ExpenseMock, error: null }));

      service.getExpense(id, id).pipe(first()).subscribe((res) => {
        expect(res.data).toEqual(ExpenseMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });

    it('should call getExpense and return error if error', () => {
      service.getExpense(id, id).pipe(first()).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });
  });


  describe('addExpense', () => {
    beforeEach(() => {
      mockProjectService.project$ = of(ProjectMock);
    });

    it('should call addExpense, update project$ and return new expense', () => {
      callApiSpy.and.returnValue(
        of({ data: ExpenseMock, error: null })
      );

      service.addExpense(id, ExpenseMock).pipe(first()).subscribe((res) => {
        expect(res.data).toEqual(ExpenseMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        mockProjectService.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual({
            ...ProjectMock,
            expenses: [ExpenseMock]
          });
        });
      });
    });

    it('should call addExpense, not update project$ and return error if error', () => {
      service.addExpense(id, ExpenseMock).pipe(first()).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        mockProjectService.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual(ProjectMock);
        });
      });
    });
  });


  describe('editExpense', () => {
    beforeEach(() => {
      callApiSpy.and.returnValue(
        of({ data: ExpenseMock, error: null })
      );
      service.addExpense(id, ExpenseMock).pipe(first()).subscribe();
      mockProjectService.project$ = of({ ...ProjectMock, expenses: [ExpenseMock] });
    });

    it('should call editExpense, update project$ and return expense data', () => {
      const newName = 'New name';
      const changedMock = { ...ExpenseMock, name: newName }
      callApiSpy.and.returnValue(
        of({ data: changedMock, error: null })
      );

      mockProjectService.project$.pipe(first()).subscribe(p => {
        expect(p).toEqual({ ...ProjectMock, expenses: [ExpenseMock] });
      });

      service.editExpense(id, id, changedMock).pipe(first()).subscribe((res) => {
        expect(res.data).toEqual(changedMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        mockProjectService.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual({ ...ProjectMock, expenses: [changedMock] });
        });
      });
    });

    it('should call editExpense, not update project$ and return error if error', () => {
      const newName = 'New name';
      const changedMock = { ...ExpenseMock, name: newName }
      callApiSpy.and.returnValue(
        of({ data: null, error: error })
      );

      mockProjectService.project$.pipe(first()).subscribe(p => {
        expect(p).toEqual({ ...ProjectMock, expenses: [ExpenseMock] });
      });

      service.editExpense(id, id, changedMock).pipe(first()).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        mockProjectService.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual({ ...ProjectMock, expenses: [ExpenseMock] });
        });
      });
    });
  });


  describe('deleteExpense', () => {
    beforeEach(() => {
      callApiSpy.and.returnValue(
        of({ data: ExpenseMock, error: null })
      );
      service.addExpense(id, ExpenseMock).pipe(first()).subscribe();
      mockProjectService.project$ = of({ ...ProjectMock, expenses: [ExpenseMock] });
    });

    it('should call deleteExpense, update project$ and return project data', () => {
      mockProjectService.project$.pipe(first()).subscribe(p => {
        expect(p).toEqual({ ...ProjectMock, expenses: [ExpenseMock] });
      });

      service.deleteExpense(id, id).pipe(first()).subscribe((res) => {
        expect(res.data).toEqual(ExpenseMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        mockProjectService.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual({ ...ProjectMock, expenses: [] });
        });
      });
    });

    it('should call deleteExpense, not update project$ and return error if error', () => {
      callApiSpy.and.returnValue(
        of({ data: null, error })
      );

      mockProjectService.project$.pipe(first()).subscribe(p => {
        expect(p).toEqual({ ...ProjectMock, expenses: [ExpenseMock] });
      });

      service.deleteExpense(id, id).pipe(first()).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        mockProjectService.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual({ ...ProjectMock, expenses: [ExpenseMock] });
        });
      });
    });
  });


  describe('vote', () => {
    const updatedExpense = {
      ...ExpenseMock,
      upvotes: [UserMock.sub],
      downvotes: [],
    };

    beforeEach(() => {
      callApiSpy.and.returnValue(
        of({ data: ExpenseMock, error: null })
      );
      ExpenseMock.upvotes = [];
      ExpenseMock.downvotes = [];
      service.addExpense(id, ExpenseMock).pipe(first()).subscribe();
      mockProjectService.project$ = of({ ...ProjectMock, expenses: [ExpenseMock] });

      callApiSpy.and.returnValue(
        of({ data: updatedExpense, error: null })
      );
    });

    it(`should call vote, update project$ and return updated expense`, () => {
      mockProjectService.project$.pipe(first()).subscribe(p => {
        expect(p).toEqual({ ...ProjectMock, expenses: [ExpenseMock] });
      });

      service.vote('up', id, id).pipe(first()).subscribe((res) => {
        expect(res.data).toEqual(updatedExpense);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        mockProjectService.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual({
            ...ProjectMock, expenses: [updatedExpense]
          });
        });
      });
    });

    it('should call vote, not update project$ and return error if invalid direction', () => {
      mockProjectService.project$.pipe(first()).subscribe(p => {
        expect(p).toEqual({ ...ProjectMock, expenses: [ExpenseMock] });
      });

      service.vote('', id, id).pipe(first()).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).not.toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        mockProjectService.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual({ ...ProjectMock, expenses: [ExpenseMock] });
        });
      });
    });

    it('should call vote, not update project$ and return error if API error', () => {
      callApiSpy.and.returnValue(
        of({ data: null, error })
      );

      mockProjectService.project$.pipe(first()).subscribe(p => {
        expect(p).toEqual({ ...ProjectMock, expenses: [ExpenseMock] });
      });

      service.deleteExpense(id, id).pipe(first()).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        mockProjectService.project$.pipe(first()).subscribe(p => {
          expect(p).toEqual({ ...ProjectMock, expenses: [ExpenseMock] });
        });
      });
    });
  });
});