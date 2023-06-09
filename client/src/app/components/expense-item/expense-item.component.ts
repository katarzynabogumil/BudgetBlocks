import { Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ExpenseModel, EmptyExpense, ExpenseService } from '@app/core';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css']
})
export class ExpenseItemComponent {
  @Input() expense: ExpenseModel = EmptyExpense;
  linkDisabled: boolean = false;

  constructor(
    private auth: AuthService,
    public expenseApi: ExpenseService
  ) { }

  remove() {
    this.linkDisabled = true;
    this.expenseApi.deleteExpense(this.expense.id as number)
      .subscribe();
  }
}
