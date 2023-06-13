import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentModel, CommentService, EmptyExpense, ExpenseModel, ExpenseService } from '@app/core';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.css']
})
export class ExpenseDetailsComponent {
  @Input() expense: ExpenseModel = EmptyExpense;
  @Input() isHidden: boolean = true;
  projectId: number = -1;
  allComments: { [key: number]: CommentModel[] } = {};
  comments: CommentModel[] = [];
  username$ = this.auth.user$
    .pipe(map((user) => user?.nickname?.replace(/\b./g, x => x.toUpperCase())));

  constructor(
    private auth: AuthService,
    public expenseApi: ExpenseService,
    private route: ActivatedRoute,
    private commentApi: CommentService
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.parent?.snapshot.params['id'];

    this.commentApi.comments$.subscribe(comments => {
      this.allComments = comments;
      this.comments = comments[this.expense.id as number];
      this.username$.subscribe((name: string | undefined) => {
        this.comments && this.comments.forEach((comment: CommentModel) => {
          if (comment.user?.nickname?.toLowerCase() === name?.toLowerCase())
            comment.isUser = true;
        });
      });
    });

  }

  removeExpense() {
    this.expenseApi.deleteExpense(this.projectId, this.expense.id as number)
      .subscribe();
  }

  removeComment(id: number) {
    this.commentApi.deleteComment(this.expense.id as number, id).subscribe();
  }
}
