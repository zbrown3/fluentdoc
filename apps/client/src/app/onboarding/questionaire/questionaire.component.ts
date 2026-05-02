import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UserService } from '../../services/user-service/user.service';
import { SUCCESS_STATUS } from '../../common/utils/constants';
import { getExperienceSelectionIcon } from '../../../utils/utils';
import { StepEventResponse } from '../../../components/stepper/stepper.component';

export interface Answer {
  experience?: string;
  shareLanguage?: boolean;
  collaborative?: boolean;
}

@Component({
  selector: 'app-onboarding-questionaire',
  standalone: true,
  imports: [NgClass, TooltipModule],
  providers: [UserService],
  templateUrl: './questionaire.component.html',
  styleUrls: ['./questionaire.component.scss'],
})
export class OnboardingQuestionaireComponent implements OnInit {
  error: boolean = false;
  response: any;
  nextStepInfo: StepEventResponse = { newIndex: 1, value: 'profile' };
  questionaireAnswers: Answer = {};

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  @Input() view: string = '';
  @Input() currentOnboardingQuestionaireState: any = {};
  @Output() newViewEvent = new EventEmitter<StepEventResponse>();

  ngOnInit(): void {
    this.questionaireAnswers = { ...this.currentOnboardingQuestionaireState };
  }

  goToNextView() {
    this.newViewEvent.emit({
      ...this.nextStepInfo,
      stepData: this.questionaireAnswers,
    });
  }

  getExperienceSelectionCardIcon(cardValue: string) {
    return getExperienceSelectionIcon(cardValue);
  }

  updateQuestionaireAnswers(key: string, value: string | boolean) {
    this.questionaireAnswers = { ...this.questionaireAnswers, [key]: value };
  }

  getIsQuestionaireComplete() {
    return (
      this.questionaireAnswers?.experience !== undefined &&
      this.questionaireAnswers?.collaborative !== undefined &&
      this.questionaireAnswers?.shareLanguage !== undefined
    );
  }

  submitQuestionaire() {
    const userId: string | null = localStorage.getItem('userId');
    const errorMessage =
      "Error setting up account. We'll try again next time you login.";
    this.userService
      .updateAccountSetupInfo(userId, this.questionaireAnswers)
      .subscribe({
        next: (response) => {
          this.response = response;
          if (this.response.status === SUCCESS_STATUS) {
            this.goToNextView();
          } else {
            this.toastr.error(errorMessage);
          }
        },
        error: () => {
          this.error = true;
          this.toastr.error(errorMessage);
        },
      });
  }
}
