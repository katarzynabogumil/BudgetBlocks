import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { CategoriesService } from './categories.service';
import { CategoryMock } from '../mocks';
import { of } from 'rxjs';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let callApiSpy: jasmine.Spy;
  let error: { message: string };
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
        CategoriesService,
        { provide: ApiService, useValue: mockApiService }
      ],
    });

    service = TestBed.inject(CategoriesService);
  });


  describe('initial', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });


  describe('changeCatOrderId', () => {
    it('should call changeCatOrderId and return category data', () => {
      callApiSpy.and.returnValue(of({ data: CategoryMock, error: null }));

      service.changeCatOrderId(id, id).subscribe((res) => {
        expect(res.data).toEqual(CategoryMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });

    it('should call changeCatOrderId and return error if error', () => {
      service.changeCatOrderId(id, id).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });
  });

});