import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  options: AnimationOptions = {
    path: '/assets/animation.json',
  };

  constructor(private auth: AuthService) { }

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

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
}
