import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment as env } from '../../../environments/environment';
import { ProjectService, CurrenciesService, ApiResponseProjectModel, RatingModel, CurrencyRatesModel, CreateProjectModel, ApiResponseCurrenciesModel } from '@app/core';
import { OpenAiService } from 'src/app/core/services/openai.service';
import { first, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    type: ['', [Validators.required, Validators.minLength(1)]],
    budget: ['', [Validators.required, Validators.minLength(1)]],
    currency: ['EUR'],
    dateFrom: [],
    dateTo: [],
    area: [],
    location: [],
    noOfGuests: [],
    occasion: [],
    origin: [],
    destination: [],
    description: [],
    refreshRates: []
  })
  currencies: string[] = [];
  id = -1;
  rating = -1;
  isAddMode = false;
  submitted = false;
  dateIsValid = true;
  isProduction: boolean = env.production;

  constructor(
    private formBuilder: FormBuilder,
    private projectApi: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private currenciesApi: CurrenciesService,
    private aiApi: OpenAiService
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);
    this.isAddMode = !this.id;
    this.currencies = this.currenciesApi.currencies;

    if (!this.isAddMode) {
      this.projectApi.getProject(this.id)
        .pipe(first())
        .subscribe((res: ApiResponseProjectModel) => {
          const projectData = res.data as CreateProjectModel;
          projectData.dateTo = projectData.dateTo?.toString().slice(0, -1);
          projectData.dateFrom = projectData.dateFrom?.toString().slice(0, -1);
          this.projectForm.patchValue(projectData);
        });
    }
  }

  handleSubmit(): void {
    this.submitted = true;
    const project = this.projectForm.value;
    if (project.dateFrom) project.dateFrom = new Date(project.dateFrom);
    if (project.dateTo) project.dateTo = new Date(project.dateTo);

    if (this.projectForm.invalid || !this.dateIsValid) {
      return;
    } else {

      this.getCurrencyRates(project).pipe(
        switchMap((rates: CurrencyRatesModel | null) => {
          if (rates) {
            project.currencyRates = rates;
            return of(rates);
          } else {
            return of(null);
          }
        })
      ).subscribe((rates: CurrencyRatesModel | null) => {
        if (rates) {
          delete project.refreshRates;
          if (this.isAddMode) {
            this.addProject(project);
          } else {
            this.editProject(this.id, project);
          }

          this.projectForm.reset();
          this.submitted = false;
          this.dateIsValid = true;
        }
      });
    }
  }

  onDateChange(): void {
    const dateTo = new Date(this.projectForm.value.dateTo).toISOString();
    const dateFrom = new Date(this.projectForm.value.dateFrom).toISOString();
    if (dateTo < dateFrom) this.dateIsValid = false;
    else this.dateIsValid = true;
  }

  close(): void {
    this.router.navigate([`/projects/`]);
  }

  private addProject(data: CreateProjectModel): void {
    this.projectApi.addProject(data)
      .pipe(first())
      .subscribe((res: ApiResponseProjectModel) => {
        if (!res.error) {
          console.log('Project added.');
          this.id = res.data.id || this.id;
          this.getRating(this.id);
        }
        else console.log(res.error);
        this.router.navigate([`/project/${res.data.id}`]);
      });
  }

  private editProject(id: number, data: CreateProjectModel): void {
    this.projectApi.editProject(id, data)
      .pipe(first())
      .subscribe((res: ApiResponseProjectModel) => {
        if (!res.error) {
          console.log('Project edited.');
          this.rating = res.data.budgetRating || this.rating;
          this.getRating(this.id);
        } else console.log(res.error);
        this.router.navigate([`/project/${id}`]);
      });
  }

  private getCurrencyRates(project: CreateProjectModel): Observable<CurrencyRatesModel> {
    if (!project.currencyRates || project.refreshRates) {
      return this.currenciesApi.currencyRates$.pipe(
        switchMap(rates => {
          if (rates.success && rates.base === project.currency) {
            return of(rates);
          } else {
            return this.currenciesApi.getRates(project.currency).pipe(
              switchMap((rates: ApiResponseCurrenciesModel) => {
                return of(rates.data);
              })
            );
          }
        })
      );
    } else {
      return of(project.currencyRates);
    }
  }

  private getRating(id: number): void {
    this.aiApi.getRating(id).pipe(first()).subscribe();
    this.aiApi.rating$.subscribe((res: RatingModel) => {
      const rating = res.rating;

      if (this.rating !== rating && rating > 0) {
        this.projectApi.getProject(id)
          .pipe(first())
          .subscribe((res: ApiResponseProjectModel) => {
            res.data.budgetRating = rating;
            this.editProject(id, res.data as CreateProjectModel);
          });
      }
    });
  }
}