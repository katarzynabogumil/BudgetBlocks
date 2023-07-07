import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthModule } from '@auth0/auth0-angular';
import { LandingComponent } from './landing.component';
import { environment as env } from '../../../environments/environment';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
  return player;
}

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AuthModule.forRoot({
          ...env.auth0,
          httpInterceptor: {
            ...env.httpInterceptor,
          },
        }),
        LottieModule.forRoot({ player: playerFactory }),
      ],
      declarations: [LandingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });


});
