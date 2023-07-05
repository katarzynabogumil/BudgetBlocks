import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { environment as env } from '../../../environments/environment';
import { UserMock } from '../mocks';

describe('UserService', () => {
  let service: UserService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        ApiService,
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });

    service = TestBed.inject(UserService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getUser and return user data', () => {
    service.getUser().subscribe((res) => {
      expect(res.data).toEqual(UserMock);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${env.api.serverUrl}/user`,
    });

    req.flush(UserMock);
  });

  it('should call saveUser and return new user', () => {
    service.saveUser(UserMock).subscribe((res) => {
      expect(res.data).toEqual(UserMock);
    });

    const req = httpController.expectOne({
      url: `${env.api.serverUrl}/user`,
      method: 'POST',
    });

    req.flush(UserMock);
  });

});