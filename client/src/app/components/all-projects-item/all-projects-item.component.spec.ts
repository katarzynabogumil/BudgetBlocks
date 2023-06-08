import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProjectsItemComponent } from './all-projects-item.component';

describe('AllProjectsItemComponent', () => {
  let component: AllProjectsItemComponent;
  let fixture: ComponentFixture<AllProjectsItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllProjectsItemComponent]
    });
    fixture = TestBed.createComponent(AllProjectsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
