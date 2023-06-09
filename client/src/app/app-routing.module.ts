import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

import { LandingComponent } from './components/landing/landing.component';
import { AllProjectsDashboardComponent } from './components/all-projects-dashboard/all-projects-dashboard.component';
import { ProjectDashboardComponent } from './components/project-dashboard/project-dashboard.component';
import { ProjectItemsContainerComponent } from './components/project-items-container/project-items-container.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ExpenseItemsContainerComponent } from './components/expense-items-container/expense-items-container.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';

const routes: Routes = [
  { 
    path: '', 
    component: LandingComponent,
    pathMatch: 'full'
  },
  { 
    path: 'projects', 
    component: AllProjectsDashboardComponent, 
    canActivate: [AuthGuard],
    children: [
      {
        path: "", 
        component: ProjectItemsContainerComponent, 
      },
      { 
        path: "add", 
        component: ProjectFormComponent, 
      },
      { 
        path: "edit/:id", 
        component: ProjectFormComponent, 
      },
    ]
  },
  { 
    path: 'project/:id', 
    component: ProjectDashboardComponent, 
    canActivate: [AuthGuard],
    children: [
      {
        path: "", 
        component: ExpenseItemsContainerComponent, 
      },
      { 
        path: "add", 
        component: ExpenseFormComponent, 
      },
      { 
        path: "edit/:expenseId", 
        component: ExpenseFormComponent, 
      },
    ]
  },
  { 
    path: '**', 
    redirectTo: '/projects'
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }