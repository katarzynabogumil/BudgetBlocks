import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ProjectModel, ProjectService, ApiResponseProjectModel, UserModel, EmptyProject } from '@app/core';

@Component({
  selector: 'app-add-users-form',
  templateUrl: './add-users-form.component.html',
  styleUrls: ['./add-users-form.component.css']
})
export class AddUsersFormComponent implements OnInit {
  addUserForm: FormGroup = this.formBuilder.group({
    invite: ['', [Validators.email]],

  })
  id = -1;
  project: ProjectModel = EmptyProject;
  submitted = false;
  success = false;
  isOwner = false;
  isInvited = false;
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

  handleSubmit(): void {
    this.submitted = true;
    this.isInvited = false;
    this.isOwner = false;
    this.success = false;

    const email = this.addUserForm.value.invite;

    this.owners.forEach((user: UserModel) => {
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

  close(): void {
    this.router.navigate([`/project/` + this.id]);
  }

  private getProject(id: number): void {
    this.projectApi.getProject(id).subscribe();
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      this.project = p;
      this.owners = p.owners || [];
      this.invitedUsers = p.invitedUsers || [];
    });
  }

  private inviteUser(email: string): void {
    this.projectApi.addUser(email, this.id)
      .subscribe((res: ApiResponseProjectModel) => {
        if (!res.error) console.log('Project edited.');
        else console.log(res.error);
      });
  }
}