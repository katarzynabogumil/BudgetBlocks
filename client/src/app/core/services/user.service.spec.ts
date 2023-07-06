import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { UserMock } from '../mocks';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let callApiSpy: jasmine.Spy;
  let error: { message: string };
  const initialSub = '';

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
        UserService,
        { provide: ApiService, useValue: mockApiService }
      ],
    });

    service = TestBed.inject(UserService);
  });


  describe('initial', () => {

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get userSub', () => {
      expect(service.userSub).toEqual(initialSub);
    });

    it('should set userSub', () => {
      const newSub = 'X';
      service.userSub = newSub;
      expect(service.userSub).toEqual(newSub);
    });
  });


  describe('getUser', () => {
    it('should call getUser and return user data', () => {
      callApiSpy.and.returnValue(of({ data: UserMock, error: null }));

      service.getUser().subscribe((res) => {
        expect(res.data).toEqual(UserMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });

    it('should call getUser and return error if error', () => {
      service.getUser().subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });
  });

  describe('saveUser', () => {
    it('should call saveUser and return new user', () => {
      callApiSpy.and.returnValue(of({ data: UserMock, error: null }));

      service.saveUser(UserMock).subscribe((res) => {
        expect(res.data).toEqual(UserMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });

    it('should call saveUser and return error if error', () => {
      service.saveUser(UserMock).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();
      });
    });
  });
});