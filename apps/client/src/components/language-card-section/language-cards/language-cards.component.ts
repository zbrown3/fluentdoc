import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgForOf, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { UserService } from '../../../app/services/user-service/user.service';
import { IntroService } from '../../../app/services/intro-service/intro.service';

import {
  APP_ROUTES,
  PRIVACY_LEVELS,
  DEFAULT_PAGINATION_CONFIG,
} from '../../../utils/constants';
import {
  getLanguageTypeById,
  getLanguagePurposeById,
  getFormattedDate,
} from '../../../utils/utils';
import { type LanguageType, type Language } from '../../../utils/types';
import {ProgressbarModule} from "ngx-bootstrap/progressbar";

@Component({
  selector: 'app-language-cards',
  standalone: true,
  imports: [
    FormsModule,
    MatPaginatorModule,
    NgForOf,
    NgOptimizedImage,
    TooltipModule,
    ProgressbarModule,
  ],
  providers: [UserService, IntroService],
  templateUrl: './language-cards.component.html',
  styleUrls: ['./language-cards.component.scss'],
})
export class LanguageCardsComponent {
  paginationConfig = DEFAULT_PAGINATION_CONFIG;
  maxDefaultFlags = 20;

  @Input() languages: Language[] = [];
  @Input() isPublicRoute: boolean = false;
  @Output() setDeleteLanguageEvent = new EventEmitter<Language>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router) {}

  getLanguagesListByPage(): Language[] {
    const startIndex =
      this.paginationConfig.pageIndex * this.paginationConfig.pageSize;
    const endIndex = startIndex + this.paginationConfig.pageSize;
    return this.languages.slice(startIndex, endIndex);
  }

  getDefaultFlag(i: number): string {
    // If the index is less than or equal to the maximum number of default flags,
    // return the corresponding default flag image.
    const index =
      i <= this.maxDefaultFlags
        ? i
        : Math.floor(Math.random() * this.maxDefaultFlags);
    return `url(assets/images/flags/default-flag-${index}.jpg)`;
  }

  formatLastEditDate(dateString: string) {
    return getFormattedDate(dateString);
  }

  getNumberOfLanguageTypesHidden(languageTypes: LanguageType[]) {
    return `+${languageTypes.length - 4} more`;
  }

  getLanguageType(typeId: string) {
    const languageType = getLanguageTypeById(typeId);

    return languageType?.type;
  }

  toggleLanguageAdditionalTypes(language: Language, event: Event) {
    event.stopPropagation();
    language.showAllLanguageTypes = !language.showAllLanguageTypes;
  }

  getLanguagePurpose(purposeId: string) {
    const languagePurpose = getLanguagePurposeById(purposeId);
    return languagePurpose?.description;
  }

  // data binding object for language deletion
  populateLanguage(language: any, event: Event) {
    event.stopPropagation();

    this.setDeleteLanguageEvent.emit(language);
  }

  handleNavigation(languageId: string) {
    if(!this.isPublicRoute) {
      this.router.navigate([`${APP_ROUTES.LANGUAGE.path}/${languageId}`]);
    } else {
      this.router.navigate([`${APP_ROUTES.VIEW_LANGUAGE.path}/${languageId}`]);
    }
  }

  handlePageEvent(event: PageEvent): void {
    this.paginationConfig.pageSize = event.pageSize;
    this.paginationConfig.pageIndex = event.pageIndex;
  }

  isTextOverflowing(element: HTMLElement): boolean {
    if (!element) return false;
    return element.scrollWidth > element.clientWidth;
  }

  protected readonly PRIVACY_LEVELS = PRIVACY_LEVELS;
}
