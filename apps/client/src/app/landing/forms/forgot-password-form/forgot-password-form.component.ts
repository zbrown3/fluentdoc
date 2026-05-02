import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgClass, NgIf, NgOptimizedImage, AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppAuthService } from '../../../services/app-auth-service/app-auth.service';
import { InputTextFieldComponent } from '../../../../components/input-text-field/input-text-field.component';
import { UAParser } from 'ua-parser-js';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgOptimizedImage,
    FormsModule,
    InputTextFieldComponent,
    AsyncPipe,
  ],
  providers: [],
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss'],
})
export class ForgotPasswordFormComponent implements OnInit {
  INITIAL_COUNTDOWN = 5;
  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  forgotPasswordFormSubmitted: boolean = false;
  showResetSuccessAlert: boolean = false;
  disableResendButton: boolean = false;
  currentTime: string = this.INITIAL_COUNTDOWN.toString();

  public timerInterval: any;

  constructor(
    private appAuthService: AppAuthService,
    private formBuilder: FormBuilder
  ) {}

  @Output() newViewEvent = new EventEmitter<string>();

  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  switchForm(form: string) {
    // reset forms
    this.forgotPasswordForm.reset();

    // emit event to update the view
    this.newViewEvent.emit(form);
  }

  get forgotPasswordControls() {
    return this.forgotPasswordForm.controls;
  }

  onChange() {
    // if form was already submitted and the email was changed,
    // reset the form submission boolean to show
    if (this.forgotPasswordFormSubmitted) {
      this.forgotPasswordFormSubmitted = false;
      this.showResetSuccessAlert = false;
    }
  }

  // Method to gather device, browser, and OS info
  private getDeviceInfo(): { browser: string; os: string; device: string } {
    const parser = new UAParser();
    const result = parser.getResult();

    const browser = result.browser.name || 'Unknown Browser';
    const os = result.os.name || 'Unknown OS';
    const device =
      result.device.model || result.device.vendor || 'Unknown Device';

    return { browser, os, device };
  }

  // send reset password email
  sendForgotPasswordEmail() {
    this.forgotPasswordFormSubmitted = true;

    // Populate browser and device info
    const deviceInfo = this.getDeviceInfo();

    if (this.forgotPasswordForm.valid) {
      const emailObject = {
        email: this.forgotPasswordControls['email'].value,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
      };

      this.appAuthService.sendResetPasswordEmail(emailObject);
      this.showResetSuccessAlert = true;
      this.disableResendButton = true;
      this.startCountdown(this.INITIAL_COUNTDOWN);
    }
  }

  startCountdown(timeLeft: number) {
    this.timerInterval = setInterval(() => {
      timeLeft--;

      this.currentTime = `${timeLeft}`;

      if (timeLeft == 0) {
        clearInterval(this.timerInterval);
        this.disableResendButton = false;
      }
    }, 1000);
  }
}
