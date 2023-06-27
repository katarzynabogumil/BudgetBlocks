import { Component, OnInit } from '@angular/core';
import { EmptyProject, ProjectModel, ProjectService, ExpenseService, ExpenseModel, ExpCategoryModel, CommentService, CategoriesService } from '@app/core';
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
  fromId: number = -1;
  toId: number = -1;

  constructor(
    private formBuilder: FormBuilder,
    private expenseApi: ExpenseService,
    private projectApi: ProjectService,
    private route: ActivatedRoute,
    private commentApi: CommentService,
    private categoriesApi: CategoriesService
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);
    this.expenseApi.compareMode$.next(false);
    this.getProject();
    this.onModeChanges();
  }

  private getProject(): void {
    this.projectApi.getProject(this.id).subscribe();
    this.projectApi.project$.subscribe((p: ProjectModel) => {
      if (p.id >= 0) {
        console.log(p);
        this.project = p;
        this.expenses = p.expenses;
        this.categories = p.categories?.sort((a, b) => {
          return a.orderId - b.orderId;
        }) || [];

        this.getComments(p.id);
        this.getExpensesToCategories();
        this.updateSum();

        console.log(this.expensesAtCatOrderId);
      }
    });
  }

  private getComments(id: number): void {
    this.commentApi.getAllComments(id).subscribe();
  }

  private getExpensesToCategories(): void {
    this.expensesAtCatOrderId = {}
    this.categories.forEach((cat: ExpCategoryModel) => {
      this.expensesAtCatOrderId[cat.orderId] = this.expenses
        .filter((exp: ExpenseModel) => exp.category && exp.category.orderId === cat.orderId)
        .map((exp: ExpenseModel) => {
          exp.showDetails === false;
          return exp;
        })
        .sort((a: ExpenseModel, b: ExpenseModel) => {
          const aVotes = ((a.upvotes || []).length - (a.downvotes || []).length)
          const bVotes = ((b.upvotes || []).length - (b.downvotes || []).length)
          if (bVotes > aVotes) return 1;
          if (bVotes < aVotes) return -1;
          if ((b.calcCost || b.cost) > (a.calcCost || a.cost)) return -1;
          if ((b.calcCost || b.cost) < (a.calcCost || a.cost)) return 1;
          return 0;
        });
    })
  }

  private onModeChanges(): void {
    this.checkboxForm.get("compareMode")?.valueChanges.subscribe(compareMode => {
      if (compareMode) {
        this.compareMode = true;
        this.markSelectedInit(this.compareMode);
        this.updateSum();
      } else {
        this.compareMode = false;
        this.updateSum();
      }
      this.expenseApi.compareMode$.next(compareMode);
    });
  }

  private markSelectedInit(flag: boolean): void {
    for (let expArr of Object.values(this.expensesAtCatOrderId)) {
      expArr[0].selected = flag;
    }
  }

  private updateSum(): void {
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
              catCost = exp.cost;
            }
          }
        })
      } else {
        if (expArr[0].calcCost) {
          this.sum += expArr[0].calcCost;
          catCost = expArr[0].calcCost;
        } else {
          this.sum += expArr[0].cost;
          catCost = expArr[0].cost;
        }
      }

      this.expenseSumsByCat[key] = catCost;

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

  handleSelect(event: Event, expense: ExpenseModel): void {
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

  toggleDetails([showDetails, expense]: [boolean, ExpenseModel]): void {
    if (!this.compareMode) {
      for (let expArr of Object.values(this.expensesAtCatOrderId)) {
        expArr.forEach(exp => {
          if (exp.id === expense.id) exp.showDetails = showDetails;
        });
      }
    }
  }

  onDragStart(fromId: number): void {
    this.fromId = fromId;
  }

  onDragEnter(toId: number): void {
    this.toId = toId;
  }

  onDragEnd(): void {
    if (this.fromId !== this.toId) {
      this.reorderCategory(this.fromId, this.toId);
    }
    this.fromId = -1;
    this.toId = -1;
  }

  private reorderCategory(fromId: number, toId: number): void {
    console.log('changed category id from', fromId, toId);
    console.log(this.project)
    const lastOrderIdToChange = Math.max(fromId, toId);

    this.categories.forEach(cat => {
      let newOrderId = -1;

      if (cat.orderId == fromId) newOrderId = toId;
      else if (fromId < toId &&
        cat.orderId > fromId &&
        cat.orderId <= toId) {
        newOrderId = cat.orderId - 1;
      } else if (fromId > toId &&
        cat.orderId >= toId &&
        cat.orderId < fromId) {
        newOrderId = cat.orderId + 1;
      }

      if (newOrderId > -1) {
        console.log('changing category, oldOrder, newOrder', cat.orderId, newOrderId)
        this.categoriesApi.changeCatOrderId(cat.id, newOrderId).subscribe(() => {
          if (cat.orderId === lastOrderIdToChange) {
            console.log('calling new project, lastIndexToChange, from, to', lastOrderIdToChange, fromId, toId)
            this.projectApi.getProject(this.id).subscribe();
          }
        });
      }
    });
  }
}
