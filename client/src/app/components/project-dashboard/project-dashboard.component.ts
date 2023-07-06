import { Component, OnInit } from '@angular/core';
import { EmptyProject, ProjectModel, ProjectService, ExpenseService, ExpCategoryModel } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css'],
})
export class ProjectDashboardComponent implements OnInit {
  id = -1;
  project: ProjectModel = EmptyProject;
  categories: ExpCategoryModel[] | undefined = [];

  compareMode = false;

  sum = 0;
  minSum = 0;
  maxSum = 0;
  expenseSumsByCat: { [key: string]: number; } = {};
  difference = 0;
  progressBarValue = 0;
  backupRates = false;

  constructor(
    private expenseApi: ExpenseService,
    private projectApi: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']) || -1;

    this.getProject(this.id);
    this.getExpenseSum();
  }

  editProject(id: number, data: ProjectModel): void {
    this.projectApi.editProject(id, data)
      .subscribe(() => {
        console.log('Project edited.');
        this.router.navigate([`/project/${id}`]);
      });
  }

  removeProject(): void {
    this.projectApi.deleteProject(this.id)
      .subscribe(() => {
        console.log('Project removed.');
        this.router.navigate([`/projects/`]);
      });
  }

  private getProject(id: number): void {
    this.projectApi.getProject(id).pipe(first()).subscribe();
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      this.project = p;
      this.categories = p.categories;
      this.backupRates = p.currencyRates?.backup ? true : false;
    });
  }

  private getExpenseSum(): void {
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
