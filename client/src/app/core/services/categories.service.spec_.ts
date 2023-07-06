import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { CategoriesService } from './categories.service';
import { environment as env } from '../../../environments/environment';
import { CategoryMock } from '../mocks';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoriesService,
        ApiService,
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(CategoriesService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call changeCatOrderId and return updated category', () => {
    const categoryId = 1;
    const newOrderId = 2;

    service.changeCatOrderId(categoryId, newOrderId).subscribe((res) => {
      expect(res.data).toEqual(CategoryMock);
    });

    const req = httpController.expectOne({
      method: 'PUT',
      url: `${env.api.serverUrl}/categories/${categoryId}/${newOrderId}`,
    });

    req.flush(CategoryMock);
  });
});