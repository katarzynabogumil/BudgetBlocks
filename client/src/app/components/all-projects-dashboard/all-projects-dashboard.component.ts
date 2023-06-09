import { Component, OnInit } from '@angular/core';
import { AuthService, AuthClientConfig, User } from '@auth0/auth0-angular';
import { map, switchMap } from 'rxjs/operators';
import { ApiResponseModel, UserModel, ProjectModel, UserService } from '@app/core';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-all-projects-dashboard',
  templateUrl: './all-projects-dashboard.component.html',
  styleUrls: ['./all-projects-dashboard.component.css']
})
export class AllProjectsDashboardComponent implements OnInit {
  user$ = this.auth.user$;
  // code$ = this.user$.pipe(map((user) => JSON.stringify(user, null, 2)));

  projects: ProjectModel[] = [];

  constructor(
    private auth: AuthService, 
    private configFactory: AuthClientConfig,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.checkIfNewUser();
    this.getProjects();
  }

  checkIfNewUser() {
    if (!this.userService.userSub) {
      this.auth.user$.subscribe(user => {

        if (user) this.userService.userSub =  user?.sub || '';
        
        this.checkIfInDb().subscribe((isInDb => {
          if (!isInDb) this.saveToDb(user);
        }));
      })
    }
  }

  checkIfInDb ():Observable<boolean> {
    return this.userService.getUser().pipe(
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
      this.userService.saveUser(user).subscribe();
    }
  }

  getProjects() {
    // input: this.userService.userSub
    // TODO
    return [];
  }
}
