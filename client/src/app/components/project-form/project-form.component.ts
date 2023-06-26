import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment as env } from '../../../environments/environment';
import { ProjectModel, ProjectService, CurrenciesService, ApiResponseProjectModel, RatingModel, CurrencyRatesModel, CreateProjectModel, EmptyCurrencyRates } from '@app/core';
import { OpenAiService } from 'src/app/core/services/openai.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup = this.formBuilder.group({
    name: ["", [Validators.required, Validators.minLength(1)]],
    type: ["", [Validators.required, Validators.minLength(1)]],
    budget: ["", [Validators.required, Validators.minLength(1)]],
    currency: ["EUR"],
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
  id: number = -1;
  rating: number = -1;
  isAddMode: boolean = false;
  submitted: boolean = false;
  dateIsValid: boolean = true;
  isProduction: boolean = env.production;

  constructor(
    private formBuilder: FormBuilder,
    private projectApi: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private currenciesApi: CurrenciesService,
    public aiApi: OpenAiService
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);
    this.isAddMode = !this.id;
    this.currencies = this.currenciesApi.currencies;

    if (!this.isAddMode) {
      this.projectApi.getProject(this.id)
        .subscribe((res: ApiResponseProjectModel) => {
          const projectData = res.data as CreateProjectModel;
          projectData.dateTo = projectData.dateTo?.toString().slice(0, -1);
          projectData.dateFrom = projectData.dateFrom?.toString().slice(0, -1);
          this.projectForm.patchValue(projectData);
        });
    }
  }

  handleSubmit() {
    this.submitted = true;
    const project = this.projectForm.value;
    if (project.dateFrom) project.dateFrom = new Date(project.dateFrom);
    if (project.dateTo) project.dateTo = new Date(project.dateTo);

    if (this.projectForm.invalid || !this.dateIsValid) {
      return;
    } else {

      if (this.isAddMode || project.refreshRates) project.currencyRates = this.getCurrencyRates(project);
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
  }

  onDateChange(event: Event) {
    const dateTo = new Date(this.projectForm.value.dateTo).toISOString();
    const dateFrom = new Date(this.projectForm.value.dateFrom).toISOString();
    if (dateTo < dateFrom) this.dateIsValid = false;
    else this.dateIsValid = true;
  }

  addProject(data: CreateProjectModel) {
    this.projectApi.addProject(data).subscribe((res: ApiResponseProjectModel) => {
      if (!res.error) {
        console.log('Project added.');
        this.id = res.data.id || this.id;
        this.getRating(this.id);
      }
      else console.log(res.error);
      this.router.navigate([`/project/${res.data.id}`]);
    });
  }

  editProject(id: number, data: CreateProjectModel) {
    this.projectApi.editProject(id, data)
      .subscribe((res: ApiResponseProjectModel) => {
        if (!res.error) {
          console.log('Project edited.');
          this.rating = res.data.budgetRating || this.rating;
          this.getRating(this.id);
        } else console.log(res.error);
        this.router.navigate([`/project/${id}`]);
      });
  }

  getCurrencyRates(project: ProjectModel): CurrencyRatesModel {
    let newRates = EmptyCurrencyRates;
    this.currenciesApi.currencyRates$.subscribe(rates => {
      if (!rates.success && ((!rates.success && !rates.error?.code) || rates.base !== project.currency)) {
        console.log('got new rates')
        this.currenciesApi.getRates(project.currency).subscribe()
      } else {
        newRates = rates;
        console.log('saved new rates', rates)
      }
    })
    return newRates;
  }

  close() {
    this.router.navigate([`/projects/`]);
  }

  getRating(id: number) {
    this.aiApi.getRating(id).subscribe();
    this.aiApi.rating$.subscribe((res: RatingModel) => {
      const rating = res.rating;

      if (this.rating !== rating && rating > 0) {
        this.projectApi.getProject(id)
          .subscribe((res: ApiResponseProjectModel) => {
            res.data.budgetRating = rating;
            this.editProject(id, res.data as CreateProjectModel);
          });
      }
    });
  }
}