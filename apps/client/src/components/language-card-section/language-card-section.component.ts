import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UserService } from '../../app/services/user-service/user.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';
import { NoLanguagesComponent } from '../no-languages/no-languages.component';
import { LanguageCardsComponent } from './language-cards/language-cards.component';

import { DashboardListViewComponent } from './list-view/list-view.component';
import { EmptySearchResultComponent } from './empty-search-result/empty-search-result.component';
import {
  type ButtonToggle,
  ButtonToggleComponent,
} from '../button-toggle/button-toggle.component';
import {
  PRIVACY_LEVELS,
  VIEWS,
} from '../../utils/constants';
import {
  type Language,
  ApiResponse,
} from '../../utils/types';
import { sortByKey } from '../../utils/utils';

import { PlanLimits } from '../../app/language/language.component';
import { IntroService } from '../../app/services/intro-service/intro.service';
import { ChecklistProgressService } from '../../app/services/checklist-progress-service/checklist-progress.service';
export interface User {
  id: string;
  email: string;
  username: string;
  numberOfLanguages?: number;
  numberOfWords?: number;
  numberOfPhrases?: number;
  languages: any;

  [key: string]: any; // Allow any extra fields (catch-all)
}

export interface DashboardViewResponse {
  user: User;
  limits: PlanLimits;
}

export type DashboardViewApiResponse = ApiResponse<DashboardViewResponse>;

@Component({
  selector: 'app-language-card-section',
  standalone: true,
  imports: [
    ButtonToggleComponent,
    LanguageCardsComponent,
    DashboardListViewComponent,
    EmptySearchResultComponent,
    FormsModule,
    MatButtonToggleModule,
    NoLanguagesComponent,
    TooltipModule,
  ],
  providers: [
    UserService,
    IntroService,
    ChecklistProgressService,
  ],
  templateUrl: './language-card-section.component.html',
  styleUrl: './language-card-section.component.scss'
})

export class LanguageCardSectionComponent  {
  @Input() fullLanguagesList!: Language[];
  @Input() isPublicRoute: boolean = false;
  @Output() setDeleteLanguageEvent = new EventEmitter<Language>();
  languageView: string = VIEWS.CARD; // default view
  deleteConfirmation: string = '';
  filteredLanguages: Language[] = [];
  searchTerm: string = '';
  currentSort: string = 'lastUpdated'; // default sort key
  currentSortLabel: string = 'Updated';

  // Local user object to use
  // get user profile id from local storage
  _userId: any = localStorage.getItem('userId');
  user!: User;
  limits!: PlanLimits;
  response: any;
  // Variables being referenced from dashboard
  languageToDelete: any = {};

  // view button toggles
  viewButtonToggles: ButtonToggle[] = [
    {
      value: VIEWS.CARD,
      ariaLabel: 'Card View',
      icon: 'ph-squares-four',
      isActive: this.languageView === VIEWS.CARD,
      onClick: () => {
        this.languageView = VIEWS.CARD;
      },
    },
    {
      value: VIEWS.LIST,
      ariaLabel: 'List View',
      icon: 'ph-list-bullets',
      isActive: this.languageView === VIEWS.LIST,
      onClick: () => {
        this.languageView = VIEWS.LIST;
      },
    },
  ];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    protected bsModalRef: BsModalRef,
  ) {}

  onLanguageSearchChange(searchString: string): void {
    if (this.searchTerm !== searchString) {
      this.searchTerm = searchString;
    }

    if (!this || searchString.trim() === '' || !searchString) {
      this.filteredLanguages = sortByKey(this.currentSort, this.fullLanguagesList);
      return;
    }

    const lowerSearch = searchString.toLowerCase();

    this.filteredLanguages = this.fullLanguagesList.filter((language) => {
      const nameMatch = language.name?.toLowerCase().includes(lowerSearch);

      const reasonMatch = language.reasons?.some((reason: string) =>
        reason.toLowerCase().includes(lowerSearch)
      );

      const languageTypeMatch = language.types?.some((languageType: any) => {
        // type can be an object or string, adjust as needed
        if (typeof languageType === 'string') {
          return languageType.toLowerCase().includes(lowerSearch);
        }
        if (languageType?.type) {
          return languageType.type.toLowerCase().includes(lowerSearch);
        }
        return false;
      });

      return nameMatch || reasonMatch || languageTypeMatch;
    });
  }

  // data binding object for language deletion
  populateLanguage(language: Language) {
    this.languageToDelete = language;
    this.setDeleteLanguageEvent.emit(language);
  }

  updateSort(key: string, label: string) {
    this.currentSort = key;
    this.currentSortLabel = label;

    if (this.searchTerm) {
      this.filteredLanguages = sortByKey(key, this.filteredLanguages);
    } else {
      this.fullLanguagesList = sortByKey(key, this.fullLanguagesList);
    }
  }

  protected readonly PRIVACY_LEVELS = PRIVACY_LEVELS;
}
