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

  constructor(
    public expenseApi: ExpenseService,
    private route: ActivatedRoute,
    private commentApi: CommentService
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.parent?.snapshot.params['id'];

    console.log(`getting comments for ${this.expense.id}`)
    this.commentApi.getAllComments(this.expense.id as number).subscribe();
    this.commentApi.comments$.subscribe(comments => {
      console.log('comment subscription')
      this.allComments = comments;
      this.comments = comments[this.expense.id as number];
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
