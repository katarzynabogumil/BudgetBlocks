import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment as env } from '../../../environments/environment';
import { ExpenseService, ProjectService, CurrenciesService, CurrencyRatesModel, EmptyCurrencyRates, ApiResponseExpenseModel, CreateExpenseModel, ProjectModel, ExpCategoryModel, EmptyExpCategory, EmptyCreateExpCategory } from '@app/core';
import { first } from 'rxjs';
import { OpenAiService } from 'src/app/core/services/openai.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    cost: ['', [Validators.required, Validators.minLength(1)]],
    currency: ['EUR'],
    link: [],
    photo: [],
    notes: [],
    formCategory: [],
    newCategory: [],
    optional: [],
  })

  categories: ExpCategoryModel[] = [];
  allCategoryNames: string[] = [];
  currencies: string[] = [];
  projectId = -1;
  currencyRates: CurrencyRatesModel = EmptyCurrencyRates;
  expenseId = -1;
  isAddMode = false;
  isDuplicate = false;
  submitted = false;
  isProduction: boolean = env.production;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private expenseApi: ExpenseService,
    private currenciesApi: CurrenciesService,
    private projectApi: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private aiApi: OpenAiService,
    private logger: NGXLogger
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
        .pipe(first())
        .subscribe((res: ApiResponseExpenseModel) => {
          if (res.data) {
            res.data.formCategory = res.data.category.category;
            this.expenseForm.patchValue(res.data);
          }
        });
    }
  }

  handleSubmit(): void {
    this.getCategories();

    this.submitted = true;
    let expense = this.expenseForm.value;
    expense.optional = (expense.optional === 'true') ? true : false;

    const checkCatResult = this.handleCategories(expense);
    if (checkCatResult) expense = checkCatResult;
    else return;

    expense = this.recalculateCost(expense);

    if (this.expenseForm.invalid) {
      return;
    } else {
      this.loading = true;
      if (this.isAddMode) {
        this.addExpense(this.projectId, expense);
      } else {
        this.editExpense(this.projectId, this.expenseId, expense);
      }

      this.expenseForm.reset();
      this.submitted = false;
    }
  }

  close(): void {
    this.router.navigate([`/project/${this.projectId}`]);
  }


  private getCategories(): void {
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      this.categories = p.categories || [];
    });
  }

  private getCurrencyRates(): void {
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      this.currencyRates = p.currencyRates || EmptyCurrencyRates;
    });
  }

  private addExpense(projectId: number, data: CreateExpenseModel): void {
    this.expenseApi.addExpense(projectId, data)
      .pipe(first())
      .subscribe((res: ApiResponseExpenseModel) => {
        if (!res.error) {
          this.logger.log('Expense added.');
          this.getMissingCategories(projectId);
        } else this.logger.log(res.error);
        this.router.navigate([`/project/${projectId}`]);
      });
  }

  private editExpense(projectId: number, id: number, data: CreateExpenseModel): void {
    this.expenseApi.editExpense(projectId, id, data)
      .pipe(first())
      .subscribe((res: ApiResponseExpenseModel) => {
        if (!res.error) {
          this.logger.log('Expense edited.');
          this.getMissingCategories(projectId);
        } else this.logger.log(res.error);
        this.router.navigate([`/project/${this.projectId}`]);
      });
  }

  private handleCategories(expense: CreateExpenseModel): CreateExpenseModel | null {
    for (const cat of this.categories) {
      this.allCategoryNames.push(cat.category.toLowerCase());
    }

    if (!expense.formCategory) return null;

    expense.category = EmptyCreateExpCategory;
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

    expense.category.optional = expense.optional;

    delete expense.formCategory;
    delete expense.newCategory;
    delete expense.optional;

    return expense;
  }

  private recalculateCost(expense: CreateExpenseModel): CreateExpenseModel {
    const rate = this.currencyRates.rates[expense.currency];
    if (this.currencyRates.success && rate !== 1) {
      expense.calcCost = expense.cost * rate;
    } else if (this.currencyRates.base === expense.currency) {
      expense.calcCost = 0;
    }
    return expense;
  }

  private getMissingCategories(projectId: number): void {
    this.aiApi.getMissingCategories(projectId).pipe(first()).subscribe();
  }
}