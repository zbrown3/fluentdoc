import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { validateMatchingPasswords } from '../validators/matching-passwords.validator';
import { UtilityService } from '../../../services/util-service/utility.service';
import { AppAuthService } from '../../../services/app-auth-service/app-auth.service';
import { environment } from '../../../../environments/environment';
import { InputTextFieldComponent } from '../../../../components/input-text-field/input-text-field.component';
import { SUCCESS_STATUS } from '../../../common/utils/constants';
import { APP_ROUTES } from '../../../../utils/constants';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgOptimizedImage,
    FormsModule,
    InputTextFieldComponent,
  ],
  providers: [UtilityService],
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
})
export class ResetPasswordFormComponent implements OnInit {
  cookieDomain: string = environment.domain;
  errorFlow: any;
  errorDisplay: string = '';
  loggedIn: boolean = false;
  baseUrl = environment.baseUrl;
  verificationToken: string = '';

  resetPasswordForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40),
      ]),
      newPasswordConfirm: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(40),
      ]),
    },
    validateMatchingPasswords('newPassword', 'newPasswordConfirm')
  );

  resetPasswordFormSubmitted = false;
  showResetPasswordFormSuccess = false;
  showNewPassword = false;
  showNewPasswordConfirm = false;

  constructor(
    private appAuthService: AppAuthService,
    private authService: AppAuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // get temporary key from url
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['token']) {
        this.verificationToken = params['token'];
      } else {
        this.displayErrorMessage(
          'No verification token found. To ensure a secure experience, you must access this page from your email.'
        );
      }
    });
  }

  togglePasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  togglePasswordConfirmVisibility() {
    this.showNewPasswordConfirm = !this.showNewPasswordConfirm;
  }

  getPasswordIcon() {
    return this.showNewPassword ? 'ph-eye-closed' : 'ph-eye';
  }

  getPasswordConfirmIcon() {
    return this.showNewPasswordConfirm ? 'ph-eye-closed' : 'ph-eye';
  }

  get resetPasswordControls() {
    return this.resetPasswordForm.controls;
  }

  // error handling
  displayErrorMessage(message: string) {
    this.errorDisplay = message;
  }

  // send reset password email
  resetPassword() {
    this.resetPasswordFormSubmitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }

    const requestObject = {
      token: this.verificationToken,
      email: this.resetPasswordForm.controls['email'].value,
      password: this.resetPasswordForm.controls['newPassword'].value,
    };
    const errorMessage = 'An error occurred. Please try again later.';

    this.authService.resetPassword(requestObject).subscribe({
      next: (response: any) => {
        // if false is returned from the service, display error.
        if (response['status'] === SUCCESS_STATUS) {
          this.showResetPasswordFormSuccess = true;
        } else {
          this.displayErrorMessage(errorMessage);
        }
      },
      error: () => {
        this.displayErrorMessage(errorMessage);
      },
    });
  }

  // reroute to login page
  goToLogin() {
    this.router.navigate([APP_ROUTES.LOGIN.path]);
  }
}
