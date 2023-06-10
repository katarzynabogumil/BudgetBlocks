import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmptyProject, ProjectModel, ProjectService, ExpenseService, ExpenseModel, ExpCategoryModel } from '@app/core';
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
  })

  sum: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public expenseApi: ExpenseService,
    public projectApi: ProjectService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.params['id']);
    this.getProject();
    this.onChanges();
  }

  getProject() {
    this.projectApi.getProject(this.id).subscribe();

    this.projectApi.project$.subscribe((p: ProjectModel) => {
      console.log(p);
      this.project = p;
      this.expenses = p.expenses;
      this.categories = p.categories?.sort((a, b) => b.orderId - a.orderId) || [];

      this.categories.forEach((cat: ExpCategoryModel) => {
        this.expensesAtCatOrderId[cat.orderId] = this.expenses
          .filter((exp: ExpenseModel) => exp.category.orderId === cat.orderId)
      })

    });
  }

  onChanges() {
    this.checkboxForm.get("compareMode")?.valueChanges.subscribe(val => {
      if (val) {
        for (let [category, expArr] of Object.entries(this.expensesAtCatOrderId)) {
          expArr[0].selected = true;
          this.sum += expArr[0].cost;
          this.compareMode = true;
        }
      } else {
        this.sum = 0;
        this.compareMode = false;
      }
      this.expenseApi.expenseSum$.next(this.sum);
      this.expenseApi.compareMode$.next(val);
    });
  }

}