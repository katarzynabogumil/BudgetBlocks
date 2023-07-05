import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { ExpenseService } from './expense.service';
import { environment as env } from '../../../environments/environment';
import { ExpenseMock } from '../mocks';
import { BehaviorSubject, of } from 'rxjs';
import { ProjectService } from './project.service';
import { EmptyProject, ProjectModel } from '../models';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let httpController: HttpTestingController;
  let projectSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExpenseService,
        ProjectService,
        ApiService,
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });

    // const spy = spyOn<ProjectService, any>(ProjectService.prototype, 'project$')
    //   .and.returnValue(new BehaviorSubject<ProjectModel>(EmptyProject));

    const mockProjectService = jasmine.createSpyObj<ProjectService>(
      'ProjectService',
      ['project$']
    );
    mockProjectService.project$ = new BehaviorSubject<ProjectModel>(EmptyProject);

    service = TestBed.inject(ExpenseService);

    // service.expense$ = new BehaviorSubject<CommentDictModel>(comments);
    // service.expense = comments;
    // expense$ = new BehaviorSubject<ExpenseModel>(EmptyExpense);
    // expenseSum$ = new BehaviorSubject<number>(0);
    // expenseSumsByCat$ = new BehaviorSubject<{ [key: string]: number; }>({});
    // minSum$ = new BehaviorSubject<number>(0);
    // maxSum$ = new BehaviorSubject<number>(0);
    // compareMode$ = new BehaviorSubject<boolean>(false);

    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should call getAllComments and return comments dictionary', () => {
  //   const projectId = 1;

  //   const commentDict: CommentDictModel = {};
  //   commentDict[expenseId] = [ExpenseMock]

  //   service.getAllComments(projectId).subscribe((res) => {
  //     expect(res.data).toEqual(commentDict);
  //   });

  //   const req = httpController.expectOne({
  //     method: 'GET',
  //     url: `${env.api.serverUrl}/comments/${projectId}`,
  //   });

  //   req.flush(commentDict);
  // });

  // it('should call addComment and return new comment', () => {
  //   service.addComment(expenseId, ExpenseMock).subscribe((res) => {
  //     expect(res.data).toEqual(ExpenseMock);
  //   });

  //   const req = httpController.expectOne({
  //     url: `${env.api.serverUrl}/comment/${expenseId}`,
  //     method: 'POST',
  //   });

  //   req.flush(ExpenseMock);
  // });

  // it('should call deleteComment and return deleted comment', () => {
  //   const id = 1;

  //   service.deleteComment(expenseId, id).subscribe((res) => {
  //     expect(res.data).toEqual(ExpenseMock);
  //   });

  //   const req = httpController.expectOne({
  //     url: `${env.api.serverUrl}/comment/${id}`,
  //     method: 'DELETE',
  //   });

  //   req.flush(ExpenseMock);
  // });
});