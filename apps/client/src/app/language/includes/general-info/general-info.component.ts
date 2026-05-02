import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  LANGUAGE_SUBSECTIONS,
  LanguageTypes,
  LanguagePurposes,
} from '../../../common/utils/constants';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgForOf } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UtilityService } from '../../../services/util-service/utility.service';
import {
  type LanguagePurpose,
  type LanguageType,
} from '../../../../utils/types';

@Component({
  selector: 'app-general-info',
  standalone: true,
  templateUrl: './general-info.component.html',
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    TooltipModule,
    NgClass,
  ],
  providers: [UtilityService],
  styleUrls: ['./general-info.component.scss'],
})
export class GeneralInfoComponent implements OnInit {
  editLanguage: any = {};
  selectedPurposes: string[] = [];
  selectedTypes: string[] = [];
  purposes: LanguagePurpose[] = [];
  types: LanguageType[] = [];

  @Input() language: any = {};
  @Input() isSaving: boolean = false;
  @Output() submitEvent = new EventEmitter<object>();

  constructor(
    private utilService: UtilityService,
  ) {}

  ngOnInit(): void {
    this.editLanguage = { ...this.language };

    this.selectedPurposes = this.editLanguage.reasons;
    this.selectedTypes = this.editLanguage.types;

    this.purposes = this.selectedPurposes.map((key) =>
      this.getLanguagePurposeByKey(key)
    );

    this.types = this.selectedTypes.map((key) =>
      this.getLanguageTypeByKey(key)
    );
  }

  getLanguagePurposeByKey(key: string) {
    return this.languagePurposes.find(
      (purpose) => purpose.key === key
    ) as LanguagePurpose;
  }

  getLanguageTypeByKey(key: string) {
    return this.languageTypes.find((type) => type.key === key) as LanguageType;
  }

  update() {
    this.submitEvent.emit(this.editLanguage);
  }

  updateLanguageObject(key: string, value: string | string[]) {
    this.editLanguage = {
      ...this.editLanguage,
      [key]: value,
    };
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

  /***********************
   ***********************
   *        FORMAT       *
   ***********************
   **********************/
  formatDynamicString(description: string, repr: string) {
    return this.utilService.formatDynamicString(description, repr);
  }

  protected readonly languagePurposes = LanguagePurposes;
  protected readonly languageTypes = LanguageTypes;
  protected readonly SUB_SECTIONS = LANGUAGE_SUBSECTIONS;
}
