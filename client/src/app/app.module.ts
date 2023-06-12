import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { environment as env } from '../environments/environment';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AllProjectsDashboardComponent } from './components/all-projects-dashboard/all-projects-dashboard.component';
import { ProjectDashboardComponent } from './components/project-dashboard/project-dashboard.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectItemComponent } from './components/project-item/project-item.component';
import { ExpenseItemComponent } from './components/expense-item/expense-item.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { ProjectItemsContainerComponent } from './components/project-items-container/project-items-container.component';
import { ExpenseItemsContainerComponent } from './components/expense-items-container/expense-items-container.component';
import { ExpenseDetailsComponent } from './components/expense-details/expense-details.component';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AddUsersFormComponent } from './components/add-users-form/add-users-form.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    AllProjectsDashboardComponent,
    ProjectDashboardComponent,
    LandingComponent,
    NavBarComponent,
    PageLoaderComponent,
    ProjectItemComponent,
    ExpenseItemComponent,
    ProjectFormComponent,
    ExpenseFormComponent,
    AddItemComponent,
    ProjectItemsContainerComponent,
    ExpenseItemsContainerComponent,
    ExpenseDetailsComponent,
    AddUsersFormComponent
  ],
  imports: [
    BrowserModule,
    MatProgressBarModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot({
      ...env.auth0,
      httpInterceptor: {
        ...env.httpInterceptor,
      },
    }),
    LottieModule.forRoot({ player: playerFactory }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
