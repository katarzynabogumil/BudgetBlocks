import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs/operators';
import { ApiResponseModel, UserModel, UserService } from '@app/core';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-all-projects-dashboard',
  templateUrl: './all-projects-dashboard.component.html',
  styleUrls: ['./all-projects-dashboard.component.css']
})
export class AllProjectsDashboardComponent implements OnInit {
  user$ = this.auth.user$;
  // code$ = this.user$.pipe(map((user) => JSON.stringify(user, null, 2)));

  constructor(
    private auth: AuthService, 
    public userApi: UserService,
  ) {}

  ngOnInit() {
    this.checkIfNewUser();
  }

  checkIfNewUser() {
    if (!this.userApi.userSub) {
      this.auth.user$.subscribe(user => {

        if (user) this.userApi.userSub =  user?.sub || '';
        
        this.checkIfInDb().subscribe((isInDb => {
          if (!isInDb) this.saveToDb(user);
        }));
      })
    }
  }

  checkIfInDb ():Observable<boolean> {
    return this.userApi.getUser().pipe(
      switchMap((res: ApiResponseModel) => {
      return of(res.data ? true : false);
    }));
  }

  saveToDb (userData: User | null | undefined) {
    if (userData) {
      const user: UserModel = {
        sub: userData.sub || '',
        firstName: userData.given_name || userData.name || '',
        lastName: userData.family_name || userData.name || '',
        nickname: userData.nickname || '',
        email: userData.email || '',
      }
      this.userApi.saveUser(user).subscribe();
    }
  }
}
