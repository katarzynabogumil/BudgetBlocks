import { Component, Input } from '@angular/core';
import { EmptyExpense, ExpenseModel } from '@app/core';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.css']
})
export class ExpenseDetailsComponent {
  @Input() expense: ExpenseModel = EmptyExpense;
  @Input() isHidden: boolean = true;

}
