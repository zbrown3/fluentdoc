import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  FormBuilder,
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
import {
  SESSION_COOKIE,
  SUCCESS_STATUS,
} from '../../../common/utils/constants';
import { environment } from '../../../../environments/environment';
import { AppAuthService } from '../../../services/app-auth-service/app-auth.service';
import { APP_ROUTES, FD_STORAGE_KEYS } from '../../../../utils/constants';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    FormsModule,
    GoogleSigninButtonModule,
  ],
  providers: [],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  cookieDomain: string = environment.domain;
  private response: any;
  errorMessage: string | null = null;
  user: SocialUser | undefined;
  loggedIn: boolean = false;
  baseUrl = environment.baseUrl;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  showPassword = false;
  loginFormSubmitted = false;

  constructor(
    private router: Router,
    private appAuthService: AppAuthService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder
  ) {}

  @Output() newViewEvent = new EventEmitter<string>();
  @Output() formSubmissionEvent = new EventEmitter<boolean>();

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(40),
        ],
      ],
    });
  }

  get loginControls() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getPasswordIcon() {
    return this.showPassword ? 'ph-eye-closed' : 'ph-eye';
  }

  switchForm(form: string) {
    // reset everything
    this.loginForm.reset();
    this.errorMessage = null;
    this.response = {};

    // emit event to update the view
    this.newViewEvent.emit(form);
  }

  login() {
    this.loginFormSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.formSubmissionEvent.emit(this.loginFormSubmitted);

    let password: string = '';
    // base62 encode password value
    if (typeof this.loginForm.controls['password'].value === 'string') {
      password = btoa(this.loginForm.controls['password'].value);
    }

    const loginData = {
      email: this.loginForm.controls['email'].value,
      password: password,
    };

    this.appAuthService.login(loginData).subscribe({
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

          // If there's already a FTU localstorage value,
          // set it to false after successful login
          if (localStorage.getItem(FD_STORAGE_KEYS.IS_FTU) === 'true') {
            localStorage.setItem(FD_STORAGE_KEYS.IS_FTU, 'false');
          }

          this.router.navigate([APP_ROUTES.DASHBOARD.path]);
          this.formSubmissionEvent.emit(false);
        }
      },
      error: () => {
        this.formSubmissionEvent.emit(false);
        this.displayErrorMessage('Invalid email or password');
      },
    });
  }

  // Displays the error message
  displayErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
