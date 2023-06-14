import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ProjectModel, ProjectService } from '@app/core';

@Component({
  selector: 'app-project-items-container',
  templateUrl: './project-items-container.component.html',
  styleUrls: ['./project-items-container.component.css']
})
export class ProjectItemsContainerComponent implements OnInit {
  projects: ProjectModel[] = [];
  projectInvitations: ProjectModel[] = [];

  constructor(
    private auth: AuthService,
    public projectApi: ProjectService
  ) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.projectApi.getAllProjects().subscribe();
    this.projectApi.projects$.
      subscribe(res => {
        this.projects = res.sort((a: ProjectModel, b: ProjectModel) => {
          if (a.createdAt && b.createdAt
            && b.createdAt > a.createdAt) {
            return 1;
          } else return 0;
        });
        this.getProjectInvitations()
      });
  }

  getProjectInvitations() {
    this.projectApi.getProjectInvitations().subscribe();
    this.projectApi.projectInvitations$.
      subscribe(projects => {
        this.projectInvitations = projects;
      });
  }
}
