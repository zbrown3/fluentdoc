import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user-service/user.service';
import { SUCCESS_STATUS } from '../../common/utils/constants';
import { StepEventResponse } from '../../../components/stepper/stepper.component';
import { catchError, EMPTY, tap } from 'rxjs';

export interface ProfileInfo {
  username?: string;
  displayName?: string;
  bio?: string;
}

export interface UsernameValidations {
  nameLength?: boolean;
  nameCharacters?: boolean;
  nameSpaces?: boolean;
}

@Component({
  selector: 'app-onboarding-profile',
  standalone: true,
  imports: [NgClass, FormsModule, TooltipModule],
  providers: [UserService],
  templateUrl: './onboarding-profile.component.html',
  styleUrls: ['./onboarding-profile.component.scss'],
})
export class OnboardingProfileComponent implements OnInit {
  step: number = 1;
  error: boolean = false;
  response: any;
  backButtonHovered: boolean = false;
  iconPath = 'assets/images/icons/';
  profileInfo: ProfileInfo = {};
  profileNameValidations: UsernameValidations = {};

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
  ) {}

  @Input() view: string = '';
  @Input() user: any = {};
  @Input() currentOnboardingProfileState: any = {};
  @Output() newViewEvent = new EventEmitter<StepEventResponse>();

  ngOnInit() {
    this.updateProfileInfo('username', this.user?.username);
    this.updateProfileInfo('displayName', this.user?.displayName);
    this.updateProfileInfo('bio', this.user?.bio);

    this.profileInfo = {
      ...this.profileInfo,
      ...this.currentOnboardingProfileState,
    };
  }

  toggleBackButtonHover() {
    this.backButtonHovered = !this.backButtonHovered;
  }

  goToNextView(goForward: boolean) {
    const nextStepInfo = {
      newIndex: goForward ? 2 : 0,
      value: goForward ? 'conlang' : 'questionaire',
      stepData: this.profileInfo,
    };

    this.newViewEvent.emit(nextStepInfo);
  }

  updateProfileInfo(key: string, value: string | []) {
    this.profileInfo = { ...this.profileInfo, [key]: value };
  }

  isUsernameInvalid() {
    const name = this.profileInfo.username;
    const nameRegex = /^[a-zA-Z0-9-.,_']+$/;
    return (
      name !== undefined &&
      name !== '' &&
      (name.length < 3 || name.length > 16 || !nameRegex.test(name))
    );
  }

  isDisplayNameInvalid() {
    return (
      this.profileInfo?.displayName === undefined ||
      this.profileInfo?.displayName === '' ||
      (this.profileInfo?.displayName &&
        this.profileInfo?.displayName.length > 16)
    );
  }

  populateUsernameValidations() {
    if (!this.profileInfo || !this.profileInfo.username) {
      this.profileNameValidations = {
        nameLength: false,
        nameCharacters: false,
        nameSpaces: false,
      };
      return;
    }

    this.profileNameValidations = {
      nameLength:
        this.profileInfo.username.length < 4 ||
        this.profileInfo.username.length > 16,
      nameCharacters: !/^[a-zA-Z0-9-.,_']+$/.test(this.profileInfo.username),
      nameSpaces: this.profileInfo.username.includes(' '),
    };
  }

  getIsProfileComplete() {
    return !!this.profileInfo?.username && !!this.profileInfo?.displayName;
  }

  submit() {
    const userId = localStorage.getItem('userId')!;
    const requestObject = {
      username: this.profileInfo.username,
      displayName: this.profileInfo.displayName,
      bio: this.profileInfo.bio,
    };

    this.userService
      .updateUser(userId, requestObject)
      .pipe(
        tap((res: any) => {
          if (res?.status !== SUCCESS_STATUS) {
            throw new Error('Profile update failed');
          }
          this.response = res;
          this.updateProfileInfo('username', res.data.username);
          this.updateProfileInfo('displayName', res.data.displayName);
          this.updateProfileInfo('bio', res.data.bio);
        }),
        catchError(() => {
          this.toastr.error('Error updating profile. Please try again.');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.toastr.success('Profile information successfully updated!');
        this.goToNextView(true);
      });
  }
}
