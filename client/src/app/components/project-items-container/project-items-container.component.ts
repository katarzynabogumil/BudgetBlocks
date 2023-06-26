import { Component, OnInit } from '@angular/core';
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
    public projectApi: ProjectService
  ) { }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects(): void {
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

  getProjectInvitations(): void {
    this.projectApi.getProjectInvitations().subscribe();
    this.projectApi.projectInvitations$.
      subscribe(projects => {
        this.projectInvitations = projects;
      });
  }
}
