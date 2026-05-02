import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service/user.service';
import { OnboardingCreateFirstConlangComponent } from './create-first-conlang/create-first-conlang.component';
import { OnboardingProfileComponent } from './profile/onboarding-profile.component';
import { OnboardingQuestionaireComponent } from './questionaire/questionaire.component';
import {
  StepperComponent,
  Step,
  StepEventResponse,
} from '../../components/stepper/stepper.component';
import { APP_ROUTES, FD_STORAGE_KEYS } from '../../utils/constants';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    StepperComponent,
    OnboardingQuestionaireComponent,
    OnboardingProfileComponent,
    OnboardingCreateFirstConlangComponent,
  ],
  providers: [UserService],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  steps: Step[] = [
    {
      viewId: 'questionaire',
      title: 'Help us help you',
      description:
        'Help us understand your experience and goals for a more personalized experience.',
      imageSrc: 'stars.svg',
    },
    {
      viewId: 'profile',
      title: 'Set up profile',
      description:
        'Create your public profile to express your personality within the conlang universe. You can change it later.',
      imageSrc: 'profile.svg',
    },
    {
      viewId: 'conlang',
      title: 'Create your first conlang here!',
      description:
        "Let's embark on your conlang journey. You can also create later.",
      imageSrc: 'magic-wand.svg',
    },
  ];
  currentStep: number = 0;
  currentView: string = this.steps[0].viewId;
  currentOnboardingState: any[] = [];
  error: boolean = false;
  response: any;
  user: any;

  constructor(private router: Router, private userService: UserService) {}

  @Output() newViewEvent = new EventEmitter<StepEventResponse>();

  ngOnInit() {
    // get user profile info
    const userId: any = localStorage.getItem('userId');
    // populate profileInfo
    this.userService.getUserProfileInfo(userId).subscribe({
      next: (response) => {
        this.response = response;
        this.user = this.response['data'];
      },
    });

    // Setting the FTU flag
    localStorage.setItem(FD_STORAGE_KEYS.IS_FTU, 'true');
  }

  getStepperLabel() {
    return `Quick start: ${this.currentStep + 1} of 3`;
  }

  getStepImage() {
    return 'assets/images/' + this.steps[this.currentStep]['imageSrc'];
  }

  updateView(newViewInfo: StepEventResponse) {
    this.currentOnboardingState[this.currentStep] = newViewInfo.stepData;
    this.currentStep = newViewInfo.newIndex;
    this.currentView = this.steps[this.currentStep].viewId;
  }

  goToDashboard() {
    this.router.navigate([APP_ROUTES.DASHBOARD.path]);
  }
}
