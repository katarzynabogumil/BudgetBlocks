import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { CurrenciesService } from './currencies.service';
import { environment as env } from '../../../environments/environment';
import { CurrenciesMock } from '../mocks';

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrenciesService,
        ApiService,
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(CurrenciesService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getRates and return currency rates', () => {
    const base = 'EUR';
    service.getRates(base).subscribe((res) => {
      expect(res.data).toEqual(CurrenciesMock);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${env.api.serverUrl}/currencies/${base}`,
    });

    req.flush(CurrenciesMock);
  });
});