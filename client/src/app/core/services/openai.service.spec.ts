import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { OpenAiService } from './openai.service';
import { CategoriesMock, RatingMock } from '../mocks';
import { first, of } from 'rxjs';

describe('OpenAiService', () => {
  let service: OpenAiService;
  let callApiSpy: jasmine.Spy;
  let error: { message: string };
  const initialRating = { rating: 0 };
  const initialCategories = {};
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
        OpenAiService,
        { provide: ApiService, useValue: mockApiService }
      ],
    });

    service = TestBed.inject(OpenAiService);
  });


  describe('initial', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get rating', () => {
      service.rating$.pipe(first()).subscribe(r => {
        expect(r).toEqual(initialRating);
      });
    });

    it('should get categories', () => {
      service.missingCategories$.pipe(first()).subscribe(c => {
        expect(c).toEqual(initialCategories);
      });
    });
  });


  describe('getRating', () => {
    it('should call getRating, update rating$ and return rating', () => {
      callApiSpy.and.returnValue(of({ data: RatingMock, error: null }));

      service.getRating(id).subscribe((res) => {
        expect(res.data).toEqual(RatingMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.rating$.pipe(first()).subscribe(r => {
          expect(r).toEqual(RatingMock);
        });
      });
    });

    it('should call getRating, not update rating$ and return error if error', () => {
      service.getRating(id).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.rating$.pipe(first()).subscribe(r => {
          expect(r).toEqual(initialRating);
        });
      });
    });
  });

  describe('getMissingCategories', () => {
    it('should call getMissingCategories and return categories dict', () => {
      callApiSpy.and.returnValue(of({ data: { categories: CategoriesMock[id] }, error: null }));

      service.getMissingCategories(id).subscribe((res) => {
        expect(res.data).toEqual({ categories: CategoriesMock[id] });
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.missingCategories$.pipe(first()).subscribe(c => {
          expect(c).toEqual(CategoriesMock);
        });
      });
    });

    it('should call getMissingCategories and return error if error', () => {
      service.getMissingCategories(id).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.missingCategories$.pipe(first()).subscribe(c => {
          expect(c).toEqual(initialCategories);
        });
      });
    });
  });
});