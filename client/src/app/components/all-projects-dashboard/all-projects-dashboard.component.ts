import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-all-projects-dashboard',
  templateUrl: './all-projects-dashboard.component.html',
  styleUrls: ['./all-projects-dashboard.component.css']
})
export class AllProjectsDashboardComponent implements OnInit {
  user$ = this.auth.user$;
  code$ = this.user$.pipe(map((user) => JSON.stringify(user, null, 2)));

  userSub: string = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.auth.user$.subscribe(user => {
      console.log("test", user?.sub);
      this.userSub = user?.sub || '';
      // check if user id saved in services, if not, call service savig user
      // get projects for this user - userid in url - escape pipe symbol!!
    });
  }
}
