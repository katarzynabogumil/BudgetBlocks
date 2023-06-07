import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  constructor(private auth: AuthService) {}

  handleLogin(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/projects',
      },
      authorizationParams: {
        prompt: 'login',
      },
    });
  }

  handleSignUp(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/projects',
      },
      authorizationParams: {
        prompt: 'login',
        screen_hint: 'signup',
      },
    });
  }
}
