import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SUCCESS_STATUS } from '../../common/utils/constants';
import { LanguageService } from '../../services/language-service/language.service';
import { UserService } from '../../services/user-service/user.service';
import { UtilityService } from '../../services/util-service/utility.service';
import { StepEventResponse } from '../../../components/stepper/stepper.component';
import { APP_ROUTES, SHOW_LANGUAGE_TOUR } from '../../../utils/constants';
import {
  CreateLanguageFormComponent,
  type Language,
} from '../../create-language/create-language-form/create-language-form.component';
import { ApiResponse } from '../../../utils/types';
export interface CreatedLanguage {
  id?: string;

  [key: string]: any; // Allow any extra fields (catch-all)
}

export interface CreateLanguageResponse {
  language: CreatedLanguage;
  firstLanguage: boolean;
}

export type CreateLanguageApiResponse = ApiResponse<CreateLanguageResponse>;

@Component({
  selector: 'app-create-first-conlang',
  standalone: true,
  imports: [FormsModule, TooltipModule, CreateLanguageFormComponent],
  providers: [UserService, LanguageService, UtilityService],
  templateUrl: './create-first-conlang.component.html',
  styleUrls: ['./create-first-conlang.component.scss'],
})
export class OnboardingCreateFirstConlangComponent {
  step: number = 1;
  experience: string = '';
  newLanguage: Language = {};
  error: boolean = false;
  response: any;
  previousStepInfo: StepEventResponse = {newIndex: 1, value: 'profile'};

  types: string[] = [];
  @Input() view: string = '';
  @Output() newViewEvent = new EventEmitter<StepEventResponse>();

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
  ) {
  }

  goToPreviousView() {
    this.newViewEvent.emit(this.previousStepInfo);
  }

  updateLanguage(language: Language) {
    this.newLanguage = language;
  }

  getIsLanguageComplete() {
    return (
      !!this.newLanguage?.name &&
      !!this.newLanguage?.description &&
      !!this.newLanguage?.types &&
      this.newLanguage?.types.length > 0
    );
  }

  submit() {
    // add HOBBY_FUN to reasons as default if none were selected
    this.newLanguage.reasons =
      this.newLanguage?.reasons?.length === 0
        ? ['HOBBY_FUN']
        : this.newLanguage.reasons;

    this.userService.addLanguage(this.newLanguage)
      .subscribe((response: CreateLanguageApiResponse) => {
        const {firstLanguage} = response.data;
        if (response['status'] === SUCCESS_STATUS) {
          // if isFirstLanguage, set FTU tour to local storage
          if (firstLanguage) {
            localStorage.setItem(SHOW_LANGUAGE_TOUR, 'true');
          }

          // route to dashboard
          this.router.navigate([APP_ROUTES.DASHBOARD.path])
        } else {
          this.router.navigate([APP_ROUTES.DASHBOARD.path]);
          this.toastr.error(
            'There was an issue creating your language. Please try again later.'
          );
        }
      });
  }
}
