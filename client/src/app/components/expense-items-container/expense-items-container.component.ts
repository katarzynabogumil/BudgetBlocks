import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmptyProject, ProjectModel, CurrenciesService, EmptyCurrencyRates, CurrencyRatesModel, ProjectService, ExpenseService, ExpenseModel, ExpCategoryModel, EmptyExpense, ApiResponseProjectModel, CommentService } from '@app/core';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-expense-items-container',
  templateUrl: './expense-items-container.component.html',
  styleUrls: ['./expense-items-container.component.css']
})
export class ExpenseItemsContainerComponent implements OnInit {
  id: number = -1;
  project: ProjectModel = EmptyProject;
  expenses: ExpenseModel[] = [];
  expensesAtCatOrderId: { [key: string]: ExpenseModel[] } = {};
  categories: ExpCategoryModel[] = [];
  compareMode: boolean = false;
  checkboxForm: FormGroup = this.formBuilder.group({
    compareMode: [],
  });

  sum: number = 0;
  minSum: number = 0;
  maxSum: number = 0;
  expenseSumsByCat: { [key: string]: number; } = {};
  currencyRates: CurrencyRatesModel = EmptyCurrencyRates;
  showDetails: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public expenseApi: ExpenseService,
    public projectApi: ProjectService,
    private route: ActivatedRoute,
    private currenciesApi: CurrenciesService,
    private commentApi: CommentService
  ) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.params['id']);
    this.expenseApi.compareMode$.next(false);
    this.getProject();
    this.onModeChanges();
  }

  getProject() {
    this.projectApi.getProject(this.id).subscribe();
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      if (p.id) {
        console.log(p);
        this.project = p;
        this.expenses = p.expenses;
        this.categories = p.categories || [];

        this.checkCurrencyRates();
        this.getComments(p.id as number);
        this.getExpensesToCategories();
        this.updateSum();
      }
    });
  }

  checkCurrencyRates() {
    const expensesToRecalculate = this.expenses
      .filter(exp => exp.currency.toLowerCase() !== this.project.currency.toLowerCase());

    if (expensesToRecalculate.length) {
      this.getNewCurrencyRates();

      this.currenciesApi.currencyRates$.subscribe(rates => {
        this.currencyRates = rates;

        if (this.project.currencyRates?.timestamp !== rates.timestamp) {
          this.project.currencyRates = rates;

          this.projectApi.editProject(this.id, this.project)
            .subscribe((res: ApiResponseProjectModel) => {
              if (!res.error) console.log('Project edited.');
              else console.log(res.error);
            });
        }

        expensesToRecalculate.forEach((expToRecalculate: ExpenseModel) => {
          expToRecalculate.calcCost = expToRecalculate.cost * this.currencyRates.rates[expToRecalculate.currency];

          this.expenses = this.expenses
            .map((exp: ExpenseModel) => {
              if (exp.id === expToRecalculate.id) {
                exp.calcCost = expToRecalculate.calcCost;
              }
              return exp;
            });
        });
      });
    }
  }

  getNewCurrencyRates() {
    let ratesAreOld: boolean = false;
    if (this.project.currencyRates?.success) {
      const now = new Date().getTime();
      const timestamp = this.project.currencyRates.timestamp;
      if (now - timestamp > 86400) ratesAreOld = true;
    }

    if (ratesAreOld ||
      !this.project.currencyRates ||
      this.project.currencyRates.base !== this.project.currency
    ) {
      this.currenciesApi.currencyRates$.subscribe(rates => {
        if ((!rates.success && !rates.error?.code) || rates.base !== this.project.currency) {
          this.currenciesApi.getRates(this.project.currency).subscribe()
        };
      })
    }
  }

  getComments(id: number) {
    console.log('get comments called')
    this.commentApi.getAllComments(id).subscribe();
  }

  getExpensesToCategories() {
    this.expensesAtCatOrderId = {}
    this.categories.forEach((cat: ExpCategoryModel) => {
      this.expensesAtCatOrderId[cat.orderId] = this.expenses
        .filter((exp: ExpenseModel) => exp.category.orderId === cat.orderId)
        .map((exp: ExpenseModel) => {
          exp.showDetails === false;
          return exp;
        })
        .sort((a: ExpenseModel, b: ExpenseModel) => {
          return ((b.upvotes || []).length - (b.downvotes || []).length) - ((a.upvotes || []).length - (a.downvotes || []).length)
        });
    })
  }

  onModeChanges() {
    this.checkboxForm.get("compareMode")?.valueChanges.subscribe(compareMode => {
      if (compareMode) {
        this.compareMode = true;
        this.markSelectedInit(true)
        this.updateSum()
      } else {
        this.compareMode = false;
        this.updateSum()
      }
      this.expenseApi.compareMode$.next(compareMode);
    });
  }

  markSelectedInit(flag: boolean) {
    for (let expArr of Object.values(this.expensesAtCatOrderId)) {
      expArr[0].selected = flag;
    }
  }

  updateSum() {
    this.sum = 0;
    this.minSum = 0;
    this.maxSum = 0;

    for (let [key, expArr] of Object.entries(this.expensesAtCatOrderId)) {
      let catCost = 0;
      if (this.compareMode) {
        expArr.forEach(exp => {
          if (exp.selected) {
            if (exp.calcCost) {
              this.sum += exp.calcCost;
              catCost = exp.calcCost
            } else {
              this.sum += exp.cost;
              catCost = exp.cost
            }
          }
        })
      } else {
        if (expArr[0].calcCost) {
          this.sum += expArr[0].calcCost;
          catCost = expArr[0].calcCost
        } else {
          this.sum += expArr[0].cost;
          catCost = expArr[0].cost
        }
      }

      this.expenseSumsByCat[key] = catCost

      this.maxSum += expArr.reduce((a, b) => {
        return a.cost > b.cost ? a : b;
      }).cost;
      this.minSum += expArr.reduce((a, b) => {
        return a.cost < b.cost ? a : b;
      }).cost;
    }

    this.expenseApi.expenseSum$.next(this.sum);
    this.expenseApi.maxSum$.next(this.maxSum);
    this.expenseApi.minSum$.next(this.minSum);
    this.expenseApi.expenseSumsByCat$.next(this.expenseSumsByCat);
  }

  handleSelect(event: Event, expense: ExpenseModel) {
    if (this.compareMode && expense.category.expenses?.length !== 1) {
      for (let expArr of Object.values(this.expensesAtCatOrderId)) {
        for (let exp of expArr) {
          if (exp.id === expense.id) {
            if (exp.selected) {
              exp.selected = false;
              // select first - something has to be selected in a category
              expArr[0].selected = true;
            } else {
              // iterate through all and set to false
              expArr.forEach(e => e.selected = false);
              // set chosen to true
              exp.selected = true;
            }
            this.updateSum();
            return;
          }
        }
      }
    }
  }

  toggleDetails([showDetails, expense]: [boolean, ExpenseModel]) {
    if (!this.compareMode) {
      for (let expArr of Object.values(this.expensesAtCatOrderId)) {
        expArr.forEach(exp => {
          if (exp.id === expense.id) exp.showDetails = showDetails;
        });
      }
    }
  }
}