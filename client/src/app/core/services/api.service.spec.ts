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

  it('should call callApi and return valid data if no error', () => {
    const config = {
      url: `${env.api.serverUrl}/`,
      method: 'GET',
      ...service.headers
    };

    const data = '';
    const mockRes = {
      data,
      error: null
    };

    service.callApi(config).subscribe((res) => {
      expect(res).toEqual(mockRes);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${env.api.serverUrl}/`,
    });

    req.flush(data);
  });

  it('should call callApi and return no data and error if error', () => {
    const config = {
      url: `${env.api.serverUrl}/`,
      method: 'GET',
      ...service.headers
    };

    const url = `${env.api.serverUrl}/`;
    const error = { status: 500, statusText: 'Internal server error' }

    service.callApi(config).subscribe((res) => {
      expect(res.data).toEqual(null);
      expect(res.error?.message).toContain(error.status);
      expect(res.error?.message).toContain(error.statusText);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url,
    });

    req.flush('', error);
  });
});