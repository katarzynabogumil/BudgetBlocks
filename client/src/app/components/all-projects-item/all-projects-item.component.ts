import { Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ProjectModel, EmptyProject, ProjectService } from '@app/core';

@Component({
  selector: 'app-all-projects-item',
  templateUrl: './all-projects-item.component.html',
  styleUrls: ['./all-projects-item.component.css']
})
export class AllProjectsItemComponent {
  @Input() project: ProjectModel = EmptyProject;
  linkDisabled: boolean = false;

  constructor(
    private auth: AuthService,
    public projectApi: ProjectService
  ) { }

  remove() {
    this.linkDisabled = true;
    this.projectApi.deleteProject(this.project.id as number)
      .subscribe();
  }
}
