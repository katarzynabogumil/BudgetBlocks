import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

import { LandingComponent } from './components/landing/landing.component';
import { AllProjectsDashboardComponent } from './components/all-projects-dashboard/all-projects-dashboard.component';
import { ProjectDashboardComponent } from './components/project-dashboard/project-dashboard.component';

const routes: Routes = [
  { 
    path: '', 
    component: LandingComponent,
    pathMatch: 'full'
  },
  { 
    path: 'projects', 
    component: AllProjectsDashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'project/:id', 
    component: ProjectDashboardComponent, 
    canActivate: [AuthGuard] 
  },
  // { path: 'add', component: FormComponent },
  // { path: 'edit/:id', component: FormComponent }
  { 
    path: '**', 
    redirectTo: ''
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }