import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { OpenAiService } from './openai.service';
import { environment as env } from '../../../environments/environment';
import { RatingMock, CategoriesMock } from '../mocks';

describe('OpenAiService', () => {
  let service: OpenAiService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OpenAiService,
        ApiService,
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(OpenAiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getRating and return a rating', () => {
    const projectId = 1;
    service.getRating(projectId).subscribe((res) => {
      expect(res.data).toEqual(RatingMock);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${env.api.serverUrl}/rating/${projectId}`,
    });

    req.flush(RatingMock);
  });

  it('should call getMissingCategories and return string of categories', () => {
    const projectId = 1;
    service.getMissingCategories(projectId).subscribe((res) => {
      expect(res.data).toEqual(CategoriesMock);
    });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${env.api.serverUrl}/missing-categories/${projectId}`,
    });

    req.flush(CategoriesMock);
  });
});