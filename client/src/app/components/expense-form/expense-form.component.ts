import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ExpenseService, ProjectService, CurrenciesService, CurrencyRatesModel, EmptyCurrencyRates, ApiResponseExpenseModel, ExpenseModel, CreateExpenseModel, ProjectModel, ExpCategoryModel, EmptyExpCategory } from '@app/core';
import { OpenAiService } from 'src/app/core/services/openai.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    cost: [, [Validators.required, Validators.minLength(1)]],
    currency: ['EUR'],
    link: [],
    photo: [],
    notes: [],
    formCategory: [],
    newCategory: [],
  })

  categories: ExpCategoryModel[] = [];
  allCategoryNames: string[] = [];
  currencies: string[] = [];
  projectId: number = -1;
  currencyRates: CurrencyRatesModel = EmptyCurrencyRates;
  expenseId: number = -1;
  isAddMode: boolean = false;
  isDuplicate: boolean = false;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private expenseApi: ExpenseService,
    private currenciesApi: CurrenciesService,
    public projectApi: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    public aiApi: OpenAiService
  ) { }

  ngOnInit(): void {
    this.projectId = Number(this.route.parent?.snapshot.params['id']);
    this.expenseId = Number(this.route.snapshot.params['expenseId']);
    this.currencies = this.currenciesApi.currencies;

    this.isAddMode = !this.expenseId;

    this.getCategories();
    this.getCurrencyRates();

    if (!this.isAddMode) {
      this.expenseApi.getExpense(this.projectId, this.expenseId)
        .subscribe((res: ApiResponseExpenseModel) => {
          res.data.formCategory = res.data.category.category;
          this.expenseForm.patchValue(res.data);
        });
    }
  }

  getCategories() {
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      this.categories = p.categories || [];
    });
  }

  getCurrencyRates() {
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      this.currencyRates = p.currencyRates || EmptyCurrencyRates;
    });
  }

  handleSubmit() {
    this.getCategories();

    this.submitted = true;
    let expense = this.expenseForm.value as CreateExpenseModel;

    let checkCatResult = this.handleCategories(expense);
    if (checkCatResult) expense = checkCatResult;
    else return;

    expense = this.recalculateCost(this.projectId, expense);

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

  addExpense(projectId: number, data: CreateExpenseModel) {
    this.expenseApi.addExpense(projectId, data).
      subscribe((res: ApiResponseExpenseModel) => {
        if (!res.error) {
          console.log('Expense added.');
          this.getMissingCategories(projectId);
        } else console.log(res.error);
        this.router.navigate([`/project/${projectId}`]);
      });
  }

  editExpense(projectId: number, id: number, data: CreateExpenseModel) {
    this.expenseApi.editExpense(projectId, id, data).
      subscribe((res: ApiResponseExpenseModel) => {
        if (!res.error) {
          console.log('Expense edited.');
          this.getMissingCategories(projectId);
        } else console.log(res.error);
        this.router.navigate([`/project/${this.projectId}`]);
      });
  }

  handleCategories(expense: CreateExpenseModel): CreateExpenseModel | null {
    for (let cat of this.categories) {
      this.allCategoryNames.push(cat.category.toLowerCase());
    }

    expense.category = EmptyExpCategory;
    if ((!expense.formCategory && expense.newCategory) ||
      (expense.formCategory === 'add' && expense.newCategory &&
        this.allCategoryNames.includes(expense.newCategory.toLowerCase()))) {
      this.isDuplicate = true;
      return null;
    }

    if (expense.formCategory === 'add') {
      if (!expense.newCategory) return null;
      expense.category.category = expense.newCategory;
      expense.category.orderId = this.categories.reduce((a: ExpCategoryModel, b: ExpCategoryModel) => {
        return a.orderId > b.orderId ? a : b;
      }, EmptyExpCategory).orderId + 1 || 0;

    } else {
      expense.category.category = expense.formCategory || '';
      expense.category.orderId = this.categories.find(cat => {
        return cat.category === expense.formCategory;
      })?.orderId || 0;
    }
    delete expense.formCategory;
    delete expense.newCategory;

    return expense;
  }

  recalculateCost(projectId: number, expense: CreateExpenseModel): CreateExpenseModel {
    const rate = this.currencyRates.rates[expense.currency];
    if (this.currencyRates.success && rate !== 1) {
      expense.calcCost = expense.cost * rate;
    }
    return expense;
  }

  getMissingCategories(projectId: number) {
    this.aiApi.getMissingCategories(projectId).subscribe();
  }

  close() {
    this.router.navigate([`/project/${this.projectId}`]);
  }
}