import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { ProjectService } from '@app/core';
// import { UserService, AlertService } from '@app/_services';

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
    dateFrom:[""],
    dateTo:[""],
    area:[""],
    noOfGuests:[""],
    occasion:[""],
    description:[""],
  })
  id: string = '';
  isAddMode: boolean = false;
  loading = false;
  submitted = false;

  // TODO style fields
  // TODO change form depending on the option!!!
  // TODO get all data from the form
  // TODO add edit mode
  
  constructor(
    private formBuilder: FormBuilder,
    private projectApi: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    // private userService: UserService,
    // private alertService: AlertService
    ) { }
    
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    if (!this.isAddMode) {
    //   this.userService.getById(this.id)
    //         .pipe(first())
    //         .subscribe(x => this.form.patchValue(x));
    }
  }
    
    handleSubmit () {
      console.log(this.projectForm.value)
      const name = this.projectForm.value.name as string;
      if (!name.length) return;
      
      // this.projectApi.addProject(title); //TODO
      this.projectForm.reset();


      this.submitted = true;
  
      // reset alerts on submit
      // this.alertService.clear();

      // stop here if projectForm is invalid
      // if (this.projectForm.invalid) {
      //     return;
      // }

  //     this.loading = true;
  //     if (this.isAddMode) {
  //         this.createUser();
  //     } else {
  //         this.updateUser();
  //     }
    }

    // setValue(){
    //  this.editqueForm.setValue({user: this.question.user, questioning: this.question.questioning})
    // }
 
      // get f() { return this.projectForm.controls; }
  
      // private createUser() {
      //     this.userService.create(this.projectForm.value)
      //         .pipe(first())
      //         .subscribe({
      //             next: () => {
      //                 this.alertService.success('User added', { keepAfterRouteChange: true });
      //                 this.router.navigate(['../'], { relativeTo: this.route });
      //             },
      //             error: error => {
      //                 this.alertService.error(error);
      //                 this.loading = false;
      //             }
      //         });
      // }
  
      // private updateUser() {
      //     this.userService.update(this.id, this.projectForm.value)
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