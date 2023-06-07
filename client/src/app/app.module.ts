import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '@auth0/auth0-angular';
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
    PageLoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot({
      ...env.auth0,
    }),
    LottieModule.forRoot({ player: playerFactory }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
