import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ProjectModel, ProjectService, CurrenciesService, ApiResponseProjectModel, UserModel, EmptyProject } from '@app/core';

@Component({
  selector: 'app-add-users-form',
  templateUrl: './add-users-form.component.html',
  styleUrls: ['./add-users-form.component.css']
})
export class AddUsersFormComponent implements OnInit {
  addUserForm: FormGroup = this.formBuilder.group({
    invite: ["", [Validators.email]],

  })
  id: number = -1;
  project: ProjectModel = EmptyProject;
  submitted: boolean = false;
  success: boolean = false;
  isOwner: boolean = false;
  isInvited: boolean = false;
  owners: UserModel[] = [];
  invitedUsers: UserModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private projectApi: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);
    this.getProject(this.id);
  }

  getProject(id: number) {
    this.projectApi.getProject(id).subscribe();
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      this.project = p;
      this.owners = p.owners || [];
      this.invitedUsers = p.invitedUsers || [];
    });
  }

  handleSubmit() {
    this.submitted = true;
    this.isInvited = false;
    this.isOwner = false;
    this.success = false;

    const email = this.addUserForm.value.invite;

    this.owners.forEach((user: UserModel) => {
      console.log(user.email)
      if (user.email === email) {
        this.isOwner = true;
      }
    });

    this.invitedUsers.forEach((user: UserModel) => {
      if (user.email === email) {
        this.isInvited = true;
      }
    });

    if (this.addUserForm.invalid || this.isOwner || this.isInvited) return;

    this.inviteUser(email);
    this.addUserForm.reset();
    this.success = true;
    this.submitted = false;
  }

  inviteUser(email: string) {
    this.projectApi.addUser(email, this.id)
      .subscribe((res: ApiResponseProjectModel) => {
        if (!res.error) console.log('Project edited.');
        else console.log(res.error);
      });
  }

  close() {
    this.router.navigate([`/project/` + this.id]);
  }
}