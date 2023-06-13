import { Component, Input, OnInit } from '@angular/core';
import { EmptyProject, ProjectModel, ProjectService } from '@app/core';

@Component({
  selector: 'app-invite-item',
  templateUrl: './invite-item.component.html',
  styleUrls: ['./invite-item.component.css']
})
export class InviteItemComponent implements OnInit {
  @Input() project: ProjectModel = EmptyProject;

  constructor(
    private projectApi: ProjectService,
  ) { }

  ngOnInit(): void {
    // this.expenseApi.compareMode$.subscribe((isTrue: boolean) => this.compareMode = isTrue);
  }

  acceptInvitation() {
    if (this.project.id) {
      this.projectApi.acceptInvitation(this.project.id).subscribe();
    }
  }
}
