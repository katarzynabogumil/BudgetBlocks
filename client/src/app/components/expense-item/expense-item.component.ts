import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseModel, EmptyExpense, ExpenseService } from '@app/core';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css']
})
export class ExpenseItemComponent {
  @Input() expense: ExpenseModel = EmptyExpense;
  @Input() compareMode: boolean = false;
  @Output() toggleDetailsEvent = new EventEmitter();

  usersub$ = this.auth.user$.pipe(map((user) => user?.sub));
  usersub: string = '';

  showDetails: boolean = false;
  projectId: number = -1;
  upIsFilled: boolean = false;
  downIsFilled: boolean = false;

  constructor(
    private auth: AuthService,
    public expenseApi: ExpenseService,
    private route: ActivatedRoute,
  ) {
    this.projectId = this.route.parent?.snapshot.params['id'];

    this.usersub$.subscribe(sub => {
      this.usersub = sub || '';
      this.checkVotes();
    });

    this.expenseApi.expense$.subscribe(exp => {
      this.expense = exp;
      this.checkVotes();
    });
  }

  toggleDetails() {
    if (!this.compareMode) {
      this.showDetails = !this.showDetails;
      this.toggleDetailsEvent.emit([this.showDetails, this.expense]);
    }
  }

  toggleVotes(direction: string) {
    this.expenseApi.vote(direction, this.projectId, this.expense.id || 0).subscribe(res => {
    });
  }

  checkVotes() {
    if (this.expense.upvotes?.includes(this.usersub)) {
      this.upIsFilled = true;
    } else if (this.expense.downvotes?.includes(this.usersub)) {
      this.downIsFilled = true;
    }
  }
}
