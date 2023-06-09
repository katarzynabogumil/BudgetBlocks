import { Component, Input } from '@angular/core';
import { ExpenseModel, EmptyExpense } from '@app/core';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css']
})
export class ExpenseItemComponent {
  @Input() expense: ExpenseModel = EmptyExpense;
}
