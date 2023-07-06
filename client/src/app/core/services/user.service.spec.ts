import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { environment as env } from '../../../environments/environment';
import { UserMock } from '../mocks';
import { Observable, of } from 'rxjs';
import { ApiResponseModel, RequestConfigModel, UserModel } from '../models';

describe('UserService', () => {
  let service: UserService;
  let callApiSpy: jasmine.Spy;

  beforeEach(() => {
    const mockApiService = jasmine.createSpyObj<ApiService>(
      'ApiService',
      ['callApi']
    );

    callApiSpy = mockApiService.callApi.and.returnValue(
      of({ data: UserMock, error: null })
    );

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: ApiService, useValue: mockApiService }
      ],
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUser', () => {
    it('should call getUser and return user data', () => {

      service.getUser().subscribe((res) => {
        expect(res.data).toEqual(UserMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });

    it('should call getUser and return error', () => {
      const error = { message: 'Error' };
      callApiSpy.and.returnValue(of({ data: null, error }));

      service.getUser().subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });
  });

  describe('saveUser', () => {
    it('should call saveUser and return new user', () => {
      service.saveUser(UserMock).subscribe((res) => {
        expect(res.data).toEqual(UserMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });

    it('should call saveUser and return error if error', () => {
      service.saveUser(UserMock).subscribe((res) => {
        expect(res.data).toEqual(UserMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });
  });
});