import { Component, OnInit } from '@angular/core';
import { EmptyProject, ProjectModel, ProjectService, ExpenseService, ApiResponseProjectModel } from '@app/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css'],
})
export class ProjectDashboardComponent implements OnInit {
  id: number = -1;
  project: ProjectModel = EmptyProject;

  compareMode: boolean = false;

  sum: number = 0;
  progressBarValue: number = 0;
  difference: number = 0;

  constructor(
    private auth: AuthService,
    public expenseApi: ExpenseService,
    public projectApi: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.params['id']);
    this.getProject(this.id);
    this.getExpenseSum();
  }

  getProject(id: number) {
    this.projectApi.getProject(id).subscribe();
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      this.project = p;
    });
  }

  editProject(id: number, data: ProjectModel) {
    this.projectApi.editProject(id, data)
      .subscribe((res: ApiResponseProjectModel) => {
        console.log('Project edited.');
        this.router.navigate([`/project/${id}`]);
      });
  }

  removeProject() {
    this.projectApi.deleteProject(this.id as number)
      .subscribe((res: ApiResponseProjectModel) => {
        console.log('Project removed.');
        this.router.navigate([`/projects/`]);
      });
  }

  getExpenseSum() {
    this.expenseApi.expenseSum$.subscribe(sum => {
      this.sum = sum;
      this.difference = Math.abs(this.project.budget - this.sum);
      this.progressBarValue = this.sum / this.project.budget * 100;
    })
    this.expenseApi.compareMode$.subscribe(isTrue => {
      this.compareMode = isTrue;
    })
  }
}
