import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseModel, EmptyExpense, ExpenseService, ProjectService } from '@app/core';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css']
})
export class ExpenseItemComponent implements OnInit {
  @Input() expense: ExpenseModel = EmptyExpense;
  @Input() projectCurrency = '';
  @Input() compareMode = false;
  @Output() toggleDetailsEvent = new EventEmitter();

  usersub$ = this.auth.user$.pipe(map((user) => user?.sub));
  usersub = '';

  showDetails = false;
  projectId = -1;
  upIsFilled = false;
  downIsFilled = false;

  upvotes = 0;
  downvotes = 0;

  constructor(
    private auth: AuthService,
    private expenseApi: ExpenseService,
    private route: ActivatedRoute,
    private projectApi: ProjectService,
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.parent?.snapshot.params['id'];

    this.usersub$.subscribe(sub => {
      this.usersub = sub || '';
      this.checkVotes();
    });
  }

  toggleDetails(): void {
    if (!this.compareMode) {
      this.showDetails = !this.showDetails;
      this.toggleDetailsEvent.emit([this.showDetails, this.expense]);
    }
  }

  toggleVotes(direction: string): void {
    this.expenseApi.vote(direction, this.projectId, this.expense.id || 0).subscribe();
  }

  private checkVotes(): void {
    if (this.expense.upvotes?.includes(this.usersub)) {
      this.upIsFilled = true;
    } else if (this.expense.downvotes?.includes(this.usersub)) {
      this.downIsFilled = true;
    }
    this.upvotes = this.expense.upvotes?.length || 0;
    this.downvotes = this.expense.downvotes?.length || 0;
  }
}
