import { Component, Input } from '@angular/core';
import { EmptyProject, ProjectModel, ProjectService } from '@app/core';

@Component({
  selector: 'app-invite-item',
  templateUrl: './invite-item.component.html',
  styleUrls: ['./invite-item.component.css']
})
export class InviteItemComponent {
  @Input() project: ProjectModel = EmptyProject;

  constructor(
    private projectApi: ProjectService,
  ) { }

  acceptInvitation() {
    if (this.project.id) {
      this.projectApi.acceptInvitation(this.project.id).subscribe();
    }
  }
}
