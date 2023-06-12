import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmptyProject, ProjectModel, ProjectService, ExpenseService, ExpenseModel, ExpCategoryModel, EmptyExpense } from '@app/core';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  showDetails: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public expenseApi: ExpenseService,
    public projectApi: ProjectService,
    private route: ActivatedRoute,
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
      console.log(p);
      this.project = p;
      this.expenses = p.expenses;
      this.categories = p.categories || [];

      this.expensesAtCatOrderId = {}
      this.categories.forEach((cat: ExpCategoryModel) => {
        this.expensesAtCatOrderId[cat.orderId] = this.expenses
          .filter((exp: ExpenseModel) => exp.category.orderId === cat.orderId)
          .map((exp: ExpenseModel) => {
            exp.showDetails === false;
            return exp;
          });
      })

      this.updateSum();
    });
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
            this.sum += exp.cost;
            catCost = exp.cost
          }
        })
      } else {
        this.sum += expArr[0].cost;
        catCost = expArr[0].cost
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