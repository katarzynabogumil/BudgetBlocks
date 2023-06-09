import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ProjectModel, ProjectService, ApiResponseProjectModel } from '@app/core';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup = this.formBuilder.group({
    name:["", [Validators.required, Validators.minLength(1)]],
    type:["", [Validators.required, Validators.minLength(1)]],
    budget:["", [Validators.required, Validators.minLength(1)]],
    currency:["EUR"],
    dateFrom:[],
    dateTo:[],
    area:[],
    noOfGuests:[],
    occasion:[],
    destination:[],
    description:[],
  })
  id: number = -1;
  isAddMode: boolean = false;
  submitted = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private projectApi: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }
    
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);
    this.isAddMode = !this.id;

    if (!this.isAddMode) {
      this.projectApi.getProject(this.id)
        .subscribe((res: ApiResponseProjectModel) => {
          this.projectForm.patchValue(res.data);
        });
    }
  }
    
    handleSubmit () {
      this.submitted = true;
      const project = this.projectForm.value;
      
      if (this.projectForm.invalid) {
        return;
      } else {
        if (this.isAddMode) {
            this.addProject(this.projectForm.value);
        } else {
            this.editProject(this.id, this.projectForm.value);
        }
        this.projectForm.reset();
        this.submitted = false;
      }
    }

    addProject(data: ProjectModel) {
      this.projectApi.addProject(data).
        subscribe((res: ApiResponseProjectModel) => {
          console.log('Project edited.');
          this.router.navigate(['/projects']);
      });
    }

    editProject(id: number, data: ProjectModel) {
      console.log(id)
      this.projectApi.editProject(id, data).
        subscribe((res: ApiResponseProjectModel) => {
          console.log('Project edited.');
          this.router.navigate(['/projects']);
      });
    }
  }