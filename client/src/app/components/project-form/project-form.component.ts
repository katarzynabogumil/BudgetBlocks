import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ProjectModel, ProjectService, CurrenciesService, ApiResponseProjectModel, RatingModel } from '@app/core';
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
  })
  currencies: string[] = [];
  id: number = -1;
  rating: number = -1;
  isAddMode: boolean = false;
  submitted: boolean = false;
  dateIsValid: boolean = true;

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
          this.projectForm.patchValue(res.data);
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
      let id = this.id || -1;
      if (this.isAddMode) {
        this.addProject(this.projectForm.value);
      } else {
        this.editProject(this.id, this.projectForm.value);
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

  addProject(data: ProjectModel) {
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

  editProject(id: number, data: ProjectModel) {
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
            this.editProject(id, res.data);
          });
      }
    });
  }
}