import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { CurrenciesService } from './currencies.service';
import { CurrencyRatesMock, CurrencySymbolsMock } from '../mocks';
import { first, of } from 'rxjs';
import { EmptyCurrencyRates } from '../models';

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let callApiSpy: jasmine.Spy;
  let error: { message: string };
  const initialRates = EmptyCurrencyRates;
  const base = 'EUR';

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
        CurrenciesService,
        { provide: ApiService, useValue: mockApiService }
      ],
    });

    service = TestBed.inject(CurrenciesService);
  });


  describe('initial', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get currency rates', () => {
      service.currencyRates$.pipe(first()).subscribe(c => {
        expect(c).toEqual(initialRates);
      });
    });

    it('should get currency symbols', () => {
      expect(service.currencies).toEqual(CurrencySymbolsMock);
    });
  });


  describe('getRates', () => {
    it('should call getRates, update currencyRates$ and return rates', () => {
      callApiSpy.and.returnValue(of({ data: CurrencyRatesMock, error: null }));

      service.getRates(base).subscribe((res) => {
        expect(res.data).toEqual(CurrencyRatesMock);
        expect(res.error).toEqual(null);
        expect(callApiSpy).toHaveBeenCalled();

        service.currencyRates$.pipe(first()).subscribe(r => {
          expect(r).toEqual(CurrencyRatesMock);
        });
      });
    });

    it('should call getRates, not update rating$ and return error if error', () => {
      service.getRates(base).subscribe((res) => {
        expect(res.data).toEqual(null);
        expect(res.error).toEqual(error);
        expect(callApiSpy).toHaveBeenCalled();

        service.currencyRates$.pipe(first()).subscribe(c => {
          expect(c).toEqual(initialRates);
        });
      });
    });
  });

});