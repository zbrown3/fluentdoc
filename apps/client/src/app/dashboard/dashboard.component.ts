import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UserService } from '../services/user-service/user.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BS_MODAL_CONFIG, SUCCESS_STATUS } from '../common/utils/constants';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LinkedAccountModalComponent } from '../../components/linked-account-modal/linked-account-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { FormsModule } from '@angular/forms';
import { DeleteLanguageConfirmationModalComponent } from '../../components/delete-language-confirmation-modal/delete-language-confirmation-modal.component';
import { LanguageCardSectionComponent } from '../../components/language-card-section/language-card-section.component';
import { FtuChecklistFabComponent } from '../../components/ftu-checklist-fab/ftu-checklist-fab.component';

import { type ButtonToggle } from '../../components/button-toggle/button-toggle.component';
import {
  FD_STORAGE_KEYS,
  APP_ROUTES,
  PLAN_TYPES,
  PRIVACY_LEVELS,
  SHOW_FTU_TOUR,
  VIEWS,
} from '../../utils/constants';
import {
  getFormattedDate,
  getLanguageTypeById,
  getLanguagePurposeById,
  getLanguagePurposes,
  getLanguageTypes,
} from '../../utils/utils';
import {
  type LanguageType,
  type Language,
  ApiResponse,
} from '../../utils/types';
import { sortByKey } from '../../utils/utils';

import { PlanLimits } from '../language/language.component';
import { IntroService } from '../services/intro-service/intro.service';
import { ChecklistProgressService } from '../services/checklist-progress-service/checklist-progress.service';
import { catchError, forkJoin, of } from 'rxjs';
import { ProfileStatsComponent } from '../../components/profile-stats/profile-stats.component';

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
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DeleteLanguageConfirmationModalComponent,
    FormsModule,
    LoadingSpinnerComponent,
    MatButtonToggleModule,
    RouterLink,
    TooltipModule,
    NgOptimizedImage,
    LanguageCardSectionComponent,
    ProfileStatsComponent,
    FtuChecklistFabComponent,
  ],
  providers: [
    UserService,
    IntroService,
    ChecklistProgressService,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isFTU: boolean = false;
  isOnStarterPlan: boolean = false;
  languageView: string = VIEWS.CARD; // default view
  loading: boolean = true;
  deleteConfirmation: string = '';
  fullLanguagesList: Language[] = [];
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

  // checklist progress
  gettingStartedStepsCompleted: boolean = false;
  gettingStartedSteps: any;

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

  // default avatar and background URLs
  bannerBgImage: string =
    'https://fluentdoc-global.nyc3.cdn.digitaloceanspaces.com/banners/fantasy.jpg';

  constructor(
    private router: Router,
    private userService: UserService,
    private checklistProgressService: ChecklistProgressService,
    private introService: IntroService,
    private toastr: ToastrService,
    protected bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit() {
    this.spinner.show();

    // Store observables
    const dashboard$ = this.userService.getUserDashboard(this._userId).pipe(
      catchError((err) => {
        console.error('Error loading dashboard:', err);
        return of({
          data: {
            user: {
              id: '',
              email: '',
              username: '',
              displayName: 'User',
              plan: PLAN_TYPES.STARTER,
              numberOfLanguages: 0,
              numberOfWords: 0,
              numberOfPhrases: 0,
              languages: [],
            },
            limits: { languages: -1 },
          },
        });
      })
    );
    const checklistProgress$ =
      this.checklistProgressService.getChecklistProgress(this._userId).pipe(
        catchError(() => of({ status: 'ERROR', data: {} }))
      );

    forkJoin({
      dashboard: dashboard$,
      checklist: checklistProgress$,
    }).subscribe({
      next: ({ dashboard, checklist }) => {
        // Handle dashboard
        const { user, limits } = dashboard.data;
        this.user = { ...user, plan: PLAN_TYPES.FOUNDING_CREATOR };
        this.limits = { ...limits, languages: -1 };
        this.isOnStarterPlan = false;
        this.userService.setPlanTypeData(PLAN_TYPES.FOUNDING_CREATOR);

        // Checklist progress
        if (checklist.status === 'SUCCESS') {
          this.gettingStartedStepsCompleted =
            checklist.data['completedCount'] === checklist.data['totalCount'];
          this.gettingStartedSteps = checklist.data['steps'] || [];
        }

        // Tour logic
        const showTour = localStorage.getItem(SHOW_FTU_TOUR);
        if (showTour === 'true') {
          setTimeout(() => {
            this.introService.startDashboardTour();
            localStorage.setItem(SHOW_FTU_TOUR, 'false');
          }, 500);
        }

        // Linked account modal
        if (localStorage.getItem('linkedAccount')) {
          this.bsModalRef = this.bsModalService.show(
            LinkedAccountModalComponent,
            BS_MODAL_CONFIG
          );
        }

        // FTU check
        this.isFTU = localStorage.getItem(FD_STORAGE_KEYS.IS_FTU) === 'true';

        // Default to language list view if there are more than 3 languages
        if (this.user.languages.length > 3) {
          this.languageView = 'list';
        }

        this.fullLanguagesList = this.user.languages;
      },
      complete: () => {
        this.spinner.hide();
        this.loading = false;

        // Sort the languages by last updated date by default
        this.fullLanguagesList = sortByKey(
          this.currentSort,
          this.fullLanguagesList
        );
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.spinner.hide();
        this.loading = false;
      },
    });
  }

  isStarterPlan(): boolean {
    return false;
  }

  onLanguageSearchChange(searchString: string): void {
    if (this.searchTerm !== searchString) {
      this.searchTerm = searchString;
    }

    if (!this || searchString.trim() === '' || !searchString) {
      this.filteredLanguages = sortByKey(
        this.currentSort,
        this.fullLanguagesList
      );
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

  reachedLanguageLimit(): boolean {
    if (!this.user || !this.limits || this.limits.languages === -1) {
      return false;
    }

    const numberOfLanguages = this.user.numberOfLanguages ?? 0; // fallback to 0 if undefined

    return numberOfLanguages >= this.limits.languages;
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
  populateLanguage(language: Language) {
    this.languageToDelete = language;
  }

  navigateToEditLanguage(languageId: string) {
    this.router.navigate([`${APP_ROUTES.LANGUAGE.path}/${languageId}`]);
  }

  // delete language
  deleteLanguage(languageId: string) {
    this.userService.deleteLanguage(languageId).subscribe({
      next: (response) => {
        this.response = response;
        // update local language object using filter
        if (this.response['status'] === SUCCESS_STATUS) {
          this.toastr.success('Language deleted successfully!');
          this.userService.getUserDashboard(this._userId).subscribe({
            next: (response) => {
              this.response = response.data;
              this.user = this.response['user'];
              this.fullLanguagesList = this.user.languages;
            },
          });
        } else {
          this.toastr.error(
            `Unable to delete language, ${this.languageToDelete.name}, deleted. Please try again.`
          );
        }
      },
      error: () => {
        this.toastr.error(
          `Unable to delete language, ${this.languageToDelete.name}, deleted. Please try again.`
        );
      },
    });

    this.deleteConfirmation = '';
  }

  filterDataOnQuery() {
    const query = this.searchTerm.toLowerCase(); // Convert search query to lowercase

    this.filteredLanguages = this.fullLanguagesList.filter(
      (language: any) =>
        // return if anything but notes includes search query
        language.name.toLowerCase().includes(query) ||
        getLanguagePurposes(language.reasons).toLowerCase().includes(query) ||
        getLanguageTypes(language.types).toLowerCase().includes(query)
    );
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
  protected readonly PLAN_TYPES = PLAN_TYPES;
}
