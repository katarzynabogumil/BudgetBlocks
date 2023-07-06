import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { CommentService } from './comment.service';
import { environment as env } from '../../../environments/environment';
import { CommentMock } from '../mocks';
import { CommentDictModel } from '../models';
import { BehaviorSubject } from 'rxjs';

describe('CommentService', () => {
  let service: CommentService;
  let httpController: HttpTestingController;
  let expenseId: number;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CommentService,
        ApiService,
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });

    // service = TestBed.inject(CommentService);
    // expenseId = 1;
    // const comments: CommentDictModel = {};
    // comments[expenseId] = []
    // service.comments$ = new BehaviorSubject<CommentDictModel>(comments);
    // service.comments = comments;

    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllComments and return comments dictionary', () => {
    const projectId = 1;

    const commentDict: CommentDictModel = {};
    commentDict[expenseId] = [CommentMock]

    service.getAllComments(projectId).subscribe((res) => {
      expect(res.data).toEqual(commentDict);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${env.api.serverUrl}/comments/${projectId}`,
    });

    req.flush(commentDict);
  });

  it('should call addComment and return new comment', () => {
    service.addComment(expenseId, CommentMock).subscribe((res) => {
      expect(res.data).toEqual(CommentMock);
    });

    const req = httpController.expectOne({
      url: `${env.api.serverUrl}/comment/${expenseId}`,
      method: 'POST',
    });

    req.flush(CommentMock);
  });

  it('should call deleteComment and return deleted comment', () => {
    const id = 1;

    service.deleteComment(expenseId, id).subscribe((res) => {
      expect(res.data).toEqual(CommentMock);
    });

    const req = httpController.expectOne({
      url: `${env.api.serverUrl}/comment/${id}`,
      method: 'DELETE',
    });

    req.flush(CommentMock);
  });
});