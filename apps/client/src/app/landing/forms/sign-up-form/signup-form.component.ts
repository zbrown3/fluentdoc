import { Component, Output, EventEmitter } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import {
  GoogleSigninButtonModule,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { validateMatchingPasswords } from '../validators/matching-passwords.validator';
import { AppAuthService } from '../../../services/app-auth-service/app-auth.service';
import { environment } from '../../../../environments/environment';
import {
  SESSION_COOKIE,
  SUCCESS_STATUS,
} from '../../../common/utils/constants';
import {APP_ROUTES, SHOW_FTU_TOUR} from '../../../../utils/constants';
@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    FormsModule,
    GoogleSigninButtonModule,
  ],
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent {
  cookieDomain: string = environment.domain;
  private response: any;
  errorDisplay: string = '';
  user: SocialUser | undefined;
  loggedIn: boolean = false;
  baseUrl = environment.baseUrl;

  constructor(
    private router: Router,
    private appAuthService: AppAuthService,
    private cookieService: CookieService,
  ) {}

  // Form selector
  @Output() newViewEvent = new EventEmitter<string>();
  @Output() formSubmissionEvent = new EventEmitter<boolean>();

  switchForm(form: string) {
    // reset forms
    this.registerForm.reset();

    // reset errors
    this.response = {};

    // emit event to update the view
    this.newViewEvent.emit(form);
  }

  registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40),
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40),
      ]),
    },
    validateMatchingPasswords('password', 'passwordConfirm')
  );

  registerFormSubmitted = false;
  showPassword = false;
  showPasswordConfirm = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmVisibility() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  getPasswordIcon() {
    return this.showPassword ? 'ph-eye-closed' : 'ph-eye';
  }

  getPasswordConfirmIcon() {
    return this.showPasswordConfirm ? 'ph-eye-closed' : 'ph-eye';
  }

  register() {
    this.registerFormSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.formSubmissionEvent.emit(this.registerFormSubmitted);

    this.appAuthService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.response = response;
        if (this.response?.status === SUCCESS_STATUS) {
          // create login data
          const email = this.registerForm.controls.email.value;
          // base62 encode password value
          let password: string = '';
          if (typeof this.registerForm.controls.password.value === 'string') {
            password = btoa(this.registerForm.controls.password.value);
          }
          const loginData = {
            email: email,
            password: password,
          };

          this.appAuthService.login(loginData).subscribe({
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

                // set showTour in local storage
                localStorage.setItem(SHOW_FTU_TOUR, 'true');

                this.router.navigate([APP_ROUTES.ONBOARDING.path]);
                this.formSubmissionEvent.emit(false);
              }
            },
            error: () => {
              this.formSubmissionEvent.emit(false);
              this.displayErrorMessage(
                'Error logging in after registration. Please try again.'
              );
            },
          });
        }
      },
      error: (error) => {
        this.formSubmissionEvent.emit(false);
        this.displayErrorMessage(error?.message);
      },
    });
  }

  get registerControls() {
    return this.registerForm.controls;
  }

  // error handling
  displayErrorMessage(message: string) {
    this.errorDisplay = message;
  }
}
