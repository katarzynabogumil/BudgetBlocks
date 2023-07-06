import { Component, Input } from '@angular/core';
import { ProjectModel, EmptyProject, ProjectService } from '@app/core';
import { first } from 'rxjs';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css']
})
export class ProjectItemComponent {
  @Input() project: ProjectModel = EmptyProject;
  linkDisabled = false;

  constructor(
    private projectApi: ProjectService
  ) { }

  removeProject(): void {
    this.linkDisabled = true;
    this.projectApi.deleteProject(this.project.id)
      .pipe(first())
      .subscribe();
  }
}
