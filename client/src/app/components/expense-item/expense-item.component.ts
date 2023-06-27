import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseModel, EmptyExpense, ExpenseService, ProjectService, ProjectModel } from '@app/core';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css']
})
export class ExpenseItemComponent implements OnInit {
  @Input() expense: ExpenseModel = EmptyExpense;
  @Input() projectCurrency: string = '';
  @Input() compareMode: boolean = false;
  @Output() toggleDetailsEvent = new EventEmitter();

  usersub$ = this.auth.user$.pipe(map((user) => user?.sub));
  usersub: string = '';

  showDetails: boolean = false;
  projectId: number = -1;
  upIsFilled: boolean = false;
  downIsFilled: boolean = false;

  upvotes: number = 0;
  downvotes: number = 0;

  constructor(
    private auth: AuthService,
    public expenseApi: ExpenseService,
    private route: ActivatedRoute,
    public projectApi: ProjectService,
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

  checkVotes(): void {
    if (this.expense.upvotes?.includes(this.usersub)) {
      this.upIsFilled = true;
    } else if (this.expense.downvotes?.includes(this.usersub)) {
      this.downIsFilled = true;
    }
    this.upvotes = this.expense.upvotes?.length || 0;
    this.downvotes = this.expense.downvotes?.length || 0;
  }
}
