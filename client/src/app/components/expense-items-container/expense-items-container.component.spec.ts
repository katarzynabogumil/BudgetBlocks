import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseItemsContainerComponent } from './expense-items-container.component';

describe('ExpenseItemsContainerComponent', () => {
  let component: ExpenseItemsContainerComponent;
  let fixture: ComponentFixture<ExpenseItemsContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseItemsContainerComponent]
    });
    fixture = TestBed.createComponent(ExpenseItemsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
