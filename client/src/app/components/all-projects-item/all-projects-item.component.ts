import { Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ProjectModel, EmptyProject } from '@app/core';

@Component({
  selector: 'app-all-projects-item',
  templateUrl: './all-projects-item.component.html',
  styleUrls: ['./all-projects-item.component.css']
})
export class AllProjectsItemComponent {
  @Input()
  project: ProjectModel = EmptyProject;

  constructor(private auth: AuthService) { }

  // remove() {
  //   this.apiService.deleteTopic(this.topic._id);
  // }
  
  // voteUp() {
  //   this.apiService.voteUp(this.topic._id);
  // }
  
  // voteDown() {
  //   this.apiService.voteDown(this.topic._id);
  // }
}
