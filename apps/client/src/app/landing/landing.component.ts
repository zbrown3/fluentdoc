import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginFormComponent } from './forms/login-form/login-form.component';
import { SignupFormComponent } from './forms/sign-up-form/signup-form.component';
import { ForgotPasswordFormComponent } from './forms/forgot-password-form/forgot-password-form.component';
import { ResetPasswordFormComponent } from './forms/reset-password-form/reset-password-form.component';
import { AppAuthService } from '../services/app-auth-service/app-auth.service';
import {
  SESSION_COOKIE,
  SUCCESS_STATUS,
} from '../common/utils/constants';
import { environment } from '../../environments/environment';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import {APP_ROUTES, SHOW_FTU_TOUR} from '../../utils/constants';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormsModule,
    GoogleSigninButtonModule,
    LoginFormComponent,
    SignupFormComponent,
    ForgotPasswordFormComponent,
    ResetPasswordFormComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, OnDestroy {
  cookieDomain: string = environment.domain;
  private response: any;
  errorMessage: string | null = null;
  user: SocialUser | undefined;
  loggedIn: boolean = false;
  baseUrl = environment.baseUrl;
  currentPath = '';
  // View selector
  currentView = '';
  private googleAuthSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private appAuthService: AppAuthService,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private socialAuthService: SocialAuthService,
    private spinner: NgxSpinnerService,
  ) {
    this.currentPath = location.pathname;
  }

  ngOnInit() {
    if (environment.desktopMode) {
      this.router.navigate([APP_ROUTES.DASHBOARD.path]);
      return;
    }

    switch (this.currentPath) {
      case APP_ROUTES.RESET_PASSWORD.path:
        this.currentView = APP_ROUTES.RESET_PASSWORD.key;
        break;
      default:
        this.currentView = APP_ROUTES.LOGIN.key;
        break;
    }

    this.spinner.hide();

    this.googleAuthSubscription = this.socialAuthService.authState.subscribe((user) => {
      this.spinner.show();

      if (user == null) {
        this.spinner.hide();
        return;
      }

      this.user = user;
      this.loggedIn = user != null;
      // verify user through google auth server
      this.appAuthService.googleAuth(user.idToken, user.email).subscribe({
        next: (response) => {
          this.response = response;
          if (this.response?.status === SUCCESS_STATUS) {
            // TODO: This info should be stored elsewhere not in local storage
            localStorage.setItem('userId', this.response?.data?.userId);
            localStorage.setItem('authToken', this.response?.data?.sessionId);

            // set cookies for user
            this.cookieService.delete(SESSION_COOKIE);
            this.cookieService.set(
              SESSION_COOKIE,
              this.response?.data?.sessionId,
              { domain: this.cookieDomain }
            );

            // if it is a new Google user, go through
            // account setup
            if (response?.data?.registeredUser) {
              // set showTour in local storage
              localStorage.setItem(SHOW_FTU_TOUR, 'true');
              this.router.navigate([APP_ROUTES.ONBOARDING.path]);
              return;
            } else {
              this.router.navigate([APP_ROUTES.DASHBOARD.path]);
            }
          }
        },
        complete: () => {
          // hide the spinner after the request is complete
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();

          this.displayErrorMessage(
            'Error logging in with Google. Please try again later.'
          );
        },
      });
    });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      // if there was a returnUrl, display error! :)
      if (params['returnUrl']) {
        this.displayErrorMessage('You must be logged in to access that page.');
      }
      if (params['signUp']) {
        this.currentView = 'signup';
      }
    });
  }

  ngOnDestroy(): void {
    // unsubscribe from the Google auth subscription to prevent memory leaks
    this.googleAuthSubscription.unsubscribe();
  }

  updateView(view: string) {
    this.currentView = view;
  }

  showSpinner(show: boolean) {
    if (show) {
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
  }

  displayErrorMessage(message: string) {
    this.errorMessage = message;
  }

  public socialSignIn() {
    this.spinner.show();

    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((userData) => {
        this.appAuthService
          .googleAuth(userData.idToken, userData.email)
          .subscribe({
            next: (response) => {
              this.response = response;
              if (this.response?.status === SUCCESS_STATUS) {
                localStorage.setItem('userId', this.response?.data?.userId);
                localStorage.setItem(
                  'authToken',
                  this.response?.data?.sessionId
                );
                // set cookies for user
                this.cookieService.delete(SESSION_COOKIE);
                this.cookieService.set(
                  SESSION_COOKIE,
                  this.response?.data?.sessionId,
                  { domain: this.cookieDomain }
                );

                this.spinner.hide();
                // this.router.navigate(['/dashboard']);
              }
            },
            error: () => {
              console.error(
                'Error logging in with Google. Please try again later.'
              );

              this.spinner.hide();
            },
          });
      });
  }
}
