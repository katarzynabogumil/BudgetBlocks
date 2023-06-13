import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommentService, ExpenseModel, EmptyExpense } from '@app/core';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent {
  commentForm: FormGroup = this.formBuilder.group({
    comment: ["", [Validators.required]],
  })
  submitted: boolean = false;
  @Input() expense: ExpenseModel = EmptyExpense;

  constructor(
    private formBuilder: FormBuilder,
    private commentApi: CommentService,
  ) { }

  handleSubmit() {
    this.submitted = true;
    const comment = this.commentForm.value.comment;

    if (this.commentForm.invalid) return;

    this.postComment(comment);
    this.commentForm.reset();
    this.submitted = false;
  }

  postComment(text: string) {
    this.commentApi.addComment(this.expense.id || -1, { text }).subscribe();
  }
}