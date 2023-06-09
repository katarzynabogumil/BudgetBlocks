import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ExpenseService, ApiResponseExpenseModel, ExpenseModel } from '@app/core';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup = this.formBuilder.group({
    name:["", [Validators.required, Validators.minLength(1)]],
    cost:[, [Validators.required, Validators.minLength(1)]],
    currency:["EUR"],
    link:[],
    photo:[],
    notes:[],
    optional:[],
    category:[],
  })
  projectId: number = -1;
  expenseId: number = -1;
  isAddMode: boolean = false;
  submitted: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private expenseApi: ExpenseService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }
    
  ngOnInit(): void {
    this.projectId = this.route.parent?.snapshot.params['id'];
    this.expenseId = Number(this.route.snapshot.params['expenseId']);

    this.isAddMode = !this.expenseId;

    if (!this.isAddMode) {
      this.expenseApi.getExpense(this.expenseId)
        .subscribe((res: ApiResponseExpenseModel) => {
          this.expenseForm.patchValue(res.data);
        });
    }
  }
    
    handleSubmit () {
      this.submitted = true;
      const expense = this.expenseForm.value;

      if (expense.optional === 'true') expense.optional = true;
      else expense.optional = false;

      if (this.expenseForm.invalid) {
        return;
      } else {
        if (this.isAddMode) {
            this.addExpense(this.projectId, expense);
        } else {
            this.editExpense(this.expenseId, expense);
        }
        this.expenseForm.reset();
        this.submitted = false;
      }
    }

    addExpense(projectId: number, data: ExpenseModel) {
      this.expenseApi.addExpense(projectId, data).
        subscribe((res: ApiResponseExpenseModel) => {
          console.log('Expense edited.');
          this.router.navigate([`/project/${projectId}`]);
      });
    }

    editExpense(id: number, data: ExpenseModel) {
      console.log(id)
      this.expenseApi.editExpense(id, data).
        subscribe((res: ApiResponseExpenseModel) => {
          console.log('Expense edited.');
          this.router.navigate([`/project/${this.projectId}`]);
      });
    }
  }