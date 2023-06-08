import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFormComponent } from './project-form.component';

describe('ProjectFormComponent', () => {
  let component: ProjectFormComponent;
  let fixture: ComponentFixture<ProjectFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectFormComponent]
    });
    fixture = TestBed.createComponent(ProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
