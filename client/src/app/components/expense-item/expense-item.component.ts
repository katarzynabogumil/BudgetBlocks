import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ExpenseModel, EmptyExpense, ExpenseService, ProjectModel, ProjectService } from '@app/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css']
})
export class ExpenseItemComponent implements OnInit {
  @Input() expense: ExpenseModel = EmptyExpense;
  linkDisabled: boolean = false;
  projectId: number = -1;

  projects: ProjectModel[] = [];

  constructor(
    private auth: AuthService,
    public expenseApi: ExpenseService,
    private route: ActivatedRoute,
    public projectApi: ProjectService,
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.parent?.snapshot.params['id'];
    this.projectApi.projects$.subscribe(projects => this.projects);
  }

  removeExpense() {
    this.linkDisabled = true;
    this.expenseApi.deleteExpense(this.projectId, this.expense.id as number)
      .subscribe();
  }
}
