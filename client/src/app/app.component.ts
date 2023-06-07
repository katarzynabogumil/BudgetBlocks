import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title='BudgetBlocks';
  isAuth0Loading$ = this.auth.isLoading$;

  constructor(private auth: AuthService) {}
}
