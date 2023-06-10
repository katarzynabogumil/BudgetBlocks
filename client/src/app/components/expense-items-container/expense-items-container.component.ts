import { Component, OnInit } from '@angular/core';
import { EmptyProject, ProjectModel, ProjectService, ExpenseService, ApiResponseProjectModel, ExpenseModel, ExpCategoryModel } from '@app/core';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expense-items-container',
  templateUrl: './expense-items-container.component.html',
  styleUrls: ['./expense-items-container.component.css']
})
export class ExpenseItemsContainerComponent implements OnInit {
  id: number = -1;
  project: ProjectModel = EmptyProject;
  expenses: ExpenseModel[] = [];
  expensesAtCatOrderId: {[key: string]: ExpenseModel[]} = {};
  categories: ExpCategoryModel[] = [];

  constructor(
    private auth: AuthService, 
    public expenseApi: ExpenseService,
    public projectApi: ProjectService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.params['id']);
    this.getProject();
  }

  getProject() {
    this.projectApi.getProject(this.id).subscribe();

    this.expenseApi.expenses$.subscribe((e: ExpenseModel[]) => {
      this.expenses = e;
    });

    this.projectApi.project$.subscribe((p: ProjectModel) => {
      this.project = p;
      this.expenses = p.expenses;
      this.categories = p.categories || [];
      if (this.categories.length) {
        this.expenses.forEach((expense: ExpenseModel) => {
          const orderId = expense.category?.orderId || 0;
          if (!this.expensesAtCatOrderId[orderId]) {
            this.expensesAtCatOrderId[orderId] = [];
          }
          this.expensesAtCatOrderId[orderId].push(expense);
        })
      }
    });
  }
}