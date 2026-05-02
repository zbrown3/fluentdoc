import { NgClass, NgForOf } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  LanguageTypes,
  LanguagePurposes,
  SUCCESS_STATUS,
} from '../../common/utils/constants';
import { LanguageService } from '../../services/language-service/language.service';
import { UserService } from '../../services/user-service/user.service';
import { UtilityService } from '../../services/util-service/utility.service';
import { type LanguageType, type LanguagePurpose } from '../../../utils/types';

export type Language = {
  name?: string;
  types?: string[];
  description?: string;
  includeStory?: boolean;
  reasons?: string[];
};

@Component({
  selector: 'app-create-language-form',
  standalone: true,

  imports: [NgClass, NgForOf, FormsModule],
  providers: [UserService, LanguageService, UtilityService],
  templateUrl: './create-language-form.component.html',
  styleUrls: ['./create-language-form.component.scss'],
})
export class CreateLanguageFormComponent {
  response: any;
  newLanguage: Language = {};
  error: boolean = false;
  includeStory: boolean = false;
  languagePurposes = LanguagePurposes;
  languageTypes = LanguageTypes;
  selectedPurposes: string[] = [];
  selectedTypes: string[] = [];
  purposes: LanguagePurpose[] = [];
  types: LanguageType[] = [];

  constructor(
    private languageService: LanguageService,
    private toastr: ToastrService
  ) {}

  @Output() updateNewLanguageEvent = new EventEmitter<Language>();

  // return whether a story is recommended based on selections
  recommendStory() {
    // return true if language type is 'personal' or 'artlang', 'sign', or 'other'
    // OR if reason is hobby/fun, friends/group, novel, game, film, or other
    const typesRecommendedForStory = ['PERSONAL', 'ARTLANG', 'SIGN', 'OTHER'];
    const purposesRecommendedForStory = [
      'HOBBY_FUN',
      'FRIENDS_GROUP',
      'NOVEL',
      'GAME',
      'FILM',
      'OTHER',
    ];

    return (
      this.selectedTypes.some((type) =>
        typesRecommendedForStory.includes(type)
      ) ||
      this.selectedPurposes.some((purpose) =>
        purposesRecommendedForStory.includes(purpose)
      )
    );
  }

  getRandomLanguage() {
    this.languageService.getRandomLanguageName().subscribe({
      next: (response) => {
        if (response['status'] === SUCCESS_STATUS) {
          this.newLanguage.name = response['data']['randomLanguage'];
        } else {
          this.toastr.error(
            'There was an issue generating a random language name. Please try again later.'
          );
        }
      },
      error: () => {
        this.toastr.error(
          'There was an issue generating a random language name. Please try again later.'
        );
      },
    });
  }

  updateLanguageObject(key: string, value: string | string[]) {
    this.newLanguage = {
      ...this.newLanguage,
      includeStory: this.recommendStory(),
      [key]: value,
    };

    this.updateNewLanguageEvent.emit(this.newLanguage);
  }

  updateLanguageTypeSelection(type: LanguageType) {
    // If the selected type already exists in the selectedTypes array,
    if (this.selectedTypes.includes(type.key)) {
      // filter it out of the list
      this.types = this.types.filter((typeObj) => typeObj !== type);
    } else {
      // otherwise, add it to the list
      this.types.push(type);
    }

    // Update the selectedTypes array with the keys of the selected types
    this.selectedTypes = this.types.map((type) => type.key);
    this.updateLanguageObject('types', this.selectedTypes);
  }

  updateLanguagePurposeSelection(purpose: LanguagePurpose) {
    // If the selected purpose already exists in the selectedPurposes array,
    if (this.selectedPurposes.includes(purpose.key)) {
      // filter it out of the list
      this.purposes = this.purposes.filter(
        (purposeObj) => purposeObj !== purpose
      );
    } else {
      // otherwise, add it to the list
      this.purposes.push(purpose);
    }

    // Update the selectedPurposes array with the keys of the selected purposes
    this.selectedPurposes = this.purposes.map((purpose) => purpose.key);
    this.updateLanguageObject('reasons', this.selectedPurposes);
  }
}
