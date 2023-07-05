import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { environment as env } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(ApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call callApi and return data', () => {
    const config = {
      url: `${env.api.serverUrl}/`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
    };

    const mockRes = '';

    service.callApi(config).subscribe((res) => {
      expect(res.data).toEqual(mockRes);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${env.api.serverUrl}/`,
    });

    req.flush(mockRes);
  });
});