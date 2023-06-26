import { Component, OnInit } from '@angular/core';
import { EmptyProject, ProjectModel, ProjectService, ExpenseService, ApiResponseProjectModel, ExpCategoryModel } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css'],
})
export class ProjectDashboardComponent implements OnInit {
  id: number = -1;
  project: ProjectModel = EmptyProject;
  categories: ExpCategoryModel[] | undefined = [];

  compareMode: boolean = false;

  sum: number = 0;
  minSum: number = 0;
  maxSum: number = 0;
  expenseSumsByCat: { [key: string]: number; } = {};
  difference: number = 0;
  progressBarValue: number = 0;

  constructor(
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
      this.categories = p.categories;
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
    this.expenseApi.expenseSumsByCat$.subscribe(expenseSumsByCat => {
      this.expenseSumsByCat = expenseSumsByCat;
    })
    this.expenseApi.minSum$.subscribe(minSum => {
      this.minSum = minSum;
    })
    this.expenseApi.maxSum$.subscribe(maxSum => {
      this.maxSum = maxSum;
    })
    this.expenseApi.compareMode$.subscribe(isTrue => {
      this.compareMode = isTrue;
    })
  }
}
