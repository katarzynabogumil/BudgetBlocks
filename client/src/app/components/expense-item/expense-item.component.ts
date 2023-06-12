import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExpenseModel, EmptyExpense } from '@app/core';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css']
})
export class ExpenseItemComponent {
  @Input() expense: ExpenseModel = EmptyExpense;
  showDetails: boolean = false;
  @Output() toggleDetailsEvent = new EventEmitter();
  @Input() compareMode: boolean = false;

  toggleDetails() {
    if (!this.compareMode) {
      this.showDetails = !this.showDetails;
      this.toggleDetailsEvent.emit([this.showDetails, this.expense]);
    }
  }
}
