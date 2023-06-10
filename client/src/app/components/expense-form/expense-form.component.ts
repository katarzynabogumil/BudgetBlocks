import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ExpenseService, ProjectService, ApiResponseExpenseModel, ExpenseModel, ProjectModel, ExpCategoryModel, EmptyExpCategory } from '@app/core';

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
    formCategory:[],
    newCategory:[],
  })

  categories: ExpCategoryModel[] = [];
  projectId: number = -1;
  expenseId: number = -1;
  isAddMode: boolean = false;
  submitted: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private expenseApi: ExpenseService,
    public projectApi: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }
    
  ngOnInit(): void {
    this.projectId = this.route.parent?.snapshot.params['id'];
    this.expenseId = Number(this.route.snapshot.params['expenseId']);
    this.getCategories();

    this.isAddMode = !this.expenseId;

    if (!this.isAddMode) {
      this.expenseApi.getExpense(this.expenseId)
        .subscribe((res: ApiResponseExpenseModel) => {
          this.expenseForm.patchValue(res.data);
        });
    }
  }

  getCategories() {
    // this.projectApi.getProject(id).subscribe();
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      this.categories = p.categories || [];
    });
  }
    
  handleSubmit () {
    this.submitted = true;
    const expense = this.expenseForm.value;

    if (expense.optional === 'true') expense.optional = true;
    else expense.optional = false;

    expense.category = EmptyExpCategory;
    if (expense.formCategory === 'add') {
      if (!expense.newCategory) return;
      expense.category.category = expense.newCategory;
      expense.category.orderId = this.categories.reduce((a: ExpCategoryModel, b: ExpCategoryModel) => {
        return a.orderId > b.orderId ? a : b;
      }, EmptyExpCategory) || 0;
    } else {      
      expense.category.category = expense.formCategory;
      expense.category.orderId = this.categories.find(cat => {
        return cat.category === expense.formCategory;
      })?.orderId || 0;
    }
    delete expense.formCategory;
    delete expense.newCategory;

    if (this.expenseForm.invalid) {
      return;
    } else {
      if (this.isAddMode) {
          this.addExpense(this.projectId, expense);
      } else {
          this.editExpense(this.projectId, this.expenseId, expense);
      }
      this.expenseForm.reset();
      this.submitted = false;
    }
  }

  addExpense(projectId: number, data: ExpenseModel) {
    this.expenseApi.addExpense(projectId, data).
      subscribe((res: ApiResponseExpenseModel) => {
        if (!res.error) console.log('Expense added.');
        else console.log(res.error);
        this.router.navigate([`/project/${projectId}`]);
    });
  }

  editExpense(projectId: number, id: number, data: ExpenseModel) {
    this.expenseApi.editExpense(projectId, id, data).
      subscribe((res: ApiResponseExpenseModel) => {
        if (!res.error) console.log('Expense edited.');
        else console.log(res.error);
        this.router.navigate([`/project/${this.projectId}`]);
    });
  }
}