import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user-service/user.service';
import { SUCCESS_STATUS } from '../common/utils/constants';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../services/language-service/language.service';
import { UtilityService } from '../services/util-service/utility.service';
import {
  CreateLanguageFormComponent,
  type Language,
} from './create-language-form/create-language-form.component';
import { ApiResponse } from '../../utils/types';
import { SHOW_LANGUAGE_TOUR } from '../../utils/constants';
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
  selector: 'app-create-language',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CreateLanguageFormComponent,
  ],
  providers: [UserService, LanguageService, UtilityService],
  templateUrl: './create-language.component.html',
  styleUrls: ['./create-language.component.scss'],
})
export class CreateLanguageComponent {
  formSubmitted: boolean = false;
  response: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  newLanguage: Language = {};

  updateLanguage(language: Language) {
    this.newLanguage = language;
  }

  getIsLanguageComplete() {
    return (
      !!this.newLanguage?.name &&
      !!this.newLanguage?.description &&
      !!this.newLanguage?.types &&
      this.newLanguage?.types.length > 0 &&
      !!this.newLanguage?.reasons &&
      this.newLanguage?.reasons.length > 0
    );
  }

  createLanguage() {
    this.formSubmitted = true;

    this.userService.addLanguage(this.newLanguage)
      .subscribe((response: CreateLanguageApiResponse) => {
      const { language, firstLanguage } = response.data;
      if (response['status'] === SUCCESS_STATUS) {
        // if isFirstLanguage, set FTU tour to local storage
        if (firstLanguage) {
          localStorage.setItem(SHOW_LANGUAGE_TOUR, 'true');
        }

        // route to language
        const languageId = language.id;
        this.router.navigate(['/language/' + languageId]);
      } else {
        this.toastr.error(
          'There was an issue creating your language. Please try again later.'
        );
      }
    });
  }
}
