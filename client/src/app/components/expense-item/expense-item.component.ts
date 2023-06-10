import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ExpenseModel, EmptyExpense, ExpenseService } from '@app/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css']
})
export class ExpenseItemComponent implements OnInit{
  @Input() expense: ExpenseModel = EmptyExpense;
  linkDisabled: boolean = false;
  projectId: number = -1;

  constructor(
    private auth: AuthService,
    public expenseApi: ExpenseService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.parent?.snapshot.params['id'];
  }

  removeExpense() {
    this.linkDisabled = true;
    this.expenseApi.deleteExpense(this.projectId, this.expense.id as number)
      .subscribe();
  }
}
