import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { CommentService } from './comment.service';
import { CommentMock, CommentDictMock } from '../mocks';
import { first, of } from 'rxjs';

describe('CommentService', () => {
  let service: CommentService;
  let callApiSpy: jasmine.Spy;
  let error: { message: string };
  const initialComments = {};
  const id = 1;

  beforeEach(() => {
    const mockApiService = jasmine.createSpyObj<ApiService>(
      'ApiService',
      ['callApi']
    );

    error = { message: 'Error' };
    callApiSpy = mockApiService.callApi.and.returnValue(
      of({ data: null, error: error })
    );

    TestBed.configureTestingModule({
      providers: [
        CommentService,
        { provide: ApiService, useValue: mockApiService }
      ],
    });

    service = TestBed.inject(CommentService);
  });


  describe('initial', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get comments', () => {
      service.comments$.pipe(first()).subscribe(c => {
        expect(c).toEqual(initialComments);
      });
    });
  });


  describe('getAllComments', () => {
    it('should call getAllComments, update comments$ and return comment dict', () => {
      callApiSpy.and.returnValue(of({ data: CommentDictMock, error: null }));

      service.getAllComments(id).subscribe((res) => {
        expect(res.data).toEqual(CommentDictMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.comments$.pipe(first()).subscribe(r => {
          expect(r).toEqual(CommentDictMock);
        });
      });
    });

    it('should call getAllComments, not update comments$ and return error if error', () => {
      service.getAllComments(id).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.comments$.pipe(first()).subscribe(c => {
          expect(c).toEqual(initialComments);
        });
      });
    });
  });



  describe('addComment', () => {
    it('should call addComment, update comments$ and return new commnet', () => {
      callApiSpy.and.returnValue(
        of({ data: CommentMock, error: null })
      );

      service.addComment(id, CommentMock).subscribe((res) => {
        expect(res.data).toEqual(CommentMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.comments$.pipe(first()).subscribe(p => {
          expect(p).toEqual(CommentDictMock);
        });
      });
    });

    it('should call addComment, not update comments$ and return error if error', () => {
      service.addComment(id, CommentMock).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.comments$.pipe(first()).subscribe(c => {
          expect(c).toEqual(initialComments);
        });
      });
    });
  });


  describe('deleteComment', () => {
    beforeEach(() => {
      callApiSpy.and.returnValue(
        of({ data: CommentMock, error: null })
      );
      service.addComment(id, CommentMock).pipe(first()).subscribe();
    });

    it('should call deleteComment, update comments$ and return comment data', () => {
      callApiSpy.and.returnValue(
        of({ data: CommentMock, error: null })
      );

      service.comments$.pipe(first()).subscribe(p => {
        expect(p).toEqual(CommentDictMock);
      });

      service.deleteComment(id, id).subscribe((res) => {
        expect(res.data).toEqual(CommentMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.comments$.pipe(first()).subscribe(p => {
          expect(p).toEqual({ 1: [] });
        });
      });
    });

    it('should call deleteComment, not update comments$ and return error if error', () => {
      callApiSpy.and.returnValue(
        of({ data: null, error })
      );

      service.comments$.pipe(first()).subscribe(p => {
        expect(p).toEqual(CommentDictMock);
      });

      service.deleteComment(id, id).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.comments$.pipe(first()).subscribe(p => {
          expect(p).toEqual(CommentDictMock);
        });
      });
    });
  });

});