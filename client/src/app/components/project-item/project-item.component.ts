import { Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ProjectModel, EmptyProject, ProjectService } from '@app/core';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css']
})
export class ProjectItemComponent {
  @Input() project: ProjectModel = EmptyProject;
  linkDisabled: boolean = false;

  constructor(
    private auth: AuthService,
    public projectApi: ProjectService
  ) { }

  removeProject() {
    this.linkDisabled = true;
    this.projectApi.deleteProject(this.project.id as number)
      .subscribe();
  }
}
