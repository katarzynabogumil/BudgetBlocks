import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';

import { ProjectModel, ProjectService, ApiResponseModel } from '@app/core';
import { Observable, of } from 'rxjs';

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
            .pipe(first())
            .subscribe(data => this.projectForm.patchValue(data));
    }
  }
    
    handleSubmit () {
      this.submitted = true;
      const project = this.projectForm.value;
      // for (let [key, value] in Object.entries(project)) {
      //   if (value === '') value = null;
      // }
      
      if (this.projectForm.invalid) {
        return;
      } else {
        if (this.isAddMode) {
            this.addProject(this.projectForm.value);
        } else {
            this.editProject(this.projectForm.value);
        }
        this.projectForm.reset();
        this.submitted = false;
      }
    }

    addProject(data: ProjectModel) {

      this.projectApi.addProject(data).pipe(
        switchMap((res: ApiResponseModel) => {
          console.log('Project added.')
          this.router.navigate(['/projects']);
          return of(res.data ? true : false);
        })).subscribe();
      }
      
      editProject(data: ProjectModel) {
        this.projectApi.editProject(this.id, data).pipe(
          switchMap((res: ApiResponseModel) => {
            console.log('Project edited.');
            console.log(res.data);
            this.router.navigate(['/projects']);
            return of(res.data);
      }));
    }

      // private createUser() {
      //     this.projectApi.create(this.projectForm.value)
      //         .pipe(first())
      //         .subscribe({
      //             next: () => {
      //                 this.alertService.success('User added', { keepAfterRouteChange: true });
      //                 this.router.navigate(['../'], { relativeTo: this.route });

      // }
  
      // private updateUser() {
      //     this.projectApi.update(this.id, this.projectForm.value)
      //         .pipe(first())
      //         .subscribe({
      //             next: () => {
      //                 this.alertService.success('User updated', { keepAfterRouteChange: true });
      //                 this.router.navigate(['../../'], { relativeTo: this.route });
      //             },
      //             error: error => {
      //                 this.alertService.error(error);
      //                 this.loading = false;
      //             }
      //         });
      // }
  }