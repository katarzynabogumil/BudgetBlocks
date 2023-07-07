import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoriesMock, ExpenseService, ProjectMock } from '@app/core';
import { Subject } from 'rxjs';
import { OpenAiService } from 'src/app/core/services/openai.service';
import { AddItemComponent } from './add-item.component';

describe('AddItemComponent', () => {
  let mockOpenAiService: { missingCategories$: Subject<{ [key: number]: string }> };
  let mockExpenseService: { compareMode$: Subject<boolean> };
  let component: AddItemComponent;
  let fixture: ComponentFixture<AddItemComponent>;

  beforeEach(async () => {
    mockOpenAiService = { missingCategories$: new Subject() }
    mockExpenseService = { compareMode$: new Subject() }

    await TestBed.configureTestingModule({
      declarations: [AddItemComponent],
      providers: [
        { provide: OpenAiService, useValue: mockOpenAiService },
        { provide: ExpenseService, useValue: mockExpenseService },
      ],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AddItemComponent);
    component = fixture.componentInstance;

    // set inputs
    component.project = ProjectMock;
    component.link = './add';
    component.item = 'an expense';

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should update compareMode value', () => {
    mockExpenseService.compareMode$.next(true);
    expect(component.compareMode).toBeTrue();

    mockExpenseService.compareMode$.next(false);
    expect(component.compareMode).toBeFalse();
  });

  describe('Add an expense', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(AddItemComponent);
      component = fixture.componentInstance;

      // set inputs
      component.project = ProjectMock;
      component.link = './add';
      component.item = 'an expense';

      fixture.detectChanges();
    });

    it(`should update categories value if item is 'an expense'`, () => {
      mockOpenAiService.missingCategories$.next(CategoriesMock);

      const id = ProjectMock.id;
      expect(component.categories).toEqual(CategoriesMock[id]);

      fixture.detectChanges();
      const categories: HTMLDivElement = fixture.debugElement.query(
        By.css('[data-testid="missing_categories"]')
      ).nativeElement;

      expect(categories.textContent).toContain(CategoriesMock[id]);
    });
  });

  describe('Add a project', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(AddItemComponent);
      component = fixture.componentInstance;

      // set inputs
      component.project = ProjectMock;
      component.link = './add';
      component.item = 'a project';

      fixture.detectChanges();
    });

    it(`should not update categories value if item is 'an expense'`, () => {
      mockOpenAiService.missingCategories$.next(CategoriesMock);

      expect(component.categories).toEqual('');

      fixture.detectChanges();
      const categories: DebugElement = fixture.debugElement.query(
        By.css('[data-testid="missing_categories"]')
      );

      expect(categories).toBeFalsy();
    });
  });

});
