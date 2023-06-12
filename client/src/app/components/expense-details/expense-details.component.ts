import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmptyExpense, ExpenseModel, ExpenseService } from '@app/core';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.css']
})
export class ExpenseDetailsComponent {
  @Input() expense: ExpenseModel = EmptyExpense;
  @Input() isHidden: boolean = true;
  projectId: number = -1;

  constructor(
    public expenseApi: ExpenseService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.parent?.snapshot.params['id'];
  }
  removeExpense() {
    this.expenseApi.deleteExpense(this.projectId, this.expense.id as number)
      .subscribe();
  }
}
