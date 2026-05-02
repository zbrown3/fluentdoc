import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { UtilityService } from '../services/util-service/utility.service';
import { LanguageService } from '../services/language-service/language.service';

import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { ViewLanguageHeaderComponent } from './view-language-header/view-language-header.component';
// TODO: FLU-358
// import { ViewLanguageFooterComponent } from './view-language-footer/view-language-footer.component';
import { OverviewComponent } from './overview/overview.component';
import { DictionaryComponent } from './dictionary/dictionary-view.component';
import { PhrasesComponent } from './phrases/phrases.component';
import { StoriesComponent } from './stories/stories.component';

import {
  QUILL_CONFIG_READ_ONLY,
  SUCCESS_STATUS,
} from '../common/utils/constants';
import {
  type LanguageView,
  type LanguageViewSettings,
} from '../../utils/types';

import {
  APP_ROUTES,
  LANGUAGE_VIEW_MODES,
  MIN_WINDOW_SIZE,
} from '../../utils/constants';

export type ViewMode =
  (typeof LANGUAGE_VIEW_MODES)[keyof typeof LANGUAGE_VIEW_MODES];

@Component({
  selector: 'app-view-language',
  standalone: true,
  imports: [
    DatePipe,
    LoadingSpinnerComponent,
    FormsModule,
    DictionaryComponent,
    NgClass,
    OverviewComponent,
    PhrasesComponent,
    StoriesComponent,
    ViewLanguageHeaderComponent,
    // TODO: FLU-358
    // ViewLanguageFooterComponent,
  ],
  providers: [UtilityService, LanguageService],
  templateUrl: './view-language.component.html',
  styleUrls: ['./view-language.component.scss'],
})
export class ViewLanguageComponent implements OnInit, OnDestroy {
  private bpoSubscription: Subscription = new Subscription();
  private browserSubscription: Subscription = new Subscription();

  currentView: string = 'overview';
  isCustomizeStylesDrawerOpen: boolean = false;
  // TODO: we can remove isEditMode since we only have two modes now (preview (edit) and public)
  isEditMode: boolean = false;
  isMobileView: boolean = false;
  isPreviewMode: boolean = true;
  isPublicMode: boolean = false;
  language: LanguageView | null = null;
  loading: boolean = true;
  showCustomTheme: boolean = false;
  showLanguageFlag: boolean = false;

  // Default language view settings
  languageViewSettings: LanguageViewSettings = {
    includeLanguageFlag: this.showLanguageFlag,
    useFlagColors: this.showCustomTheme,
    hiddenSections: [],
    colors: {
      primary: '#293a98',
      secondary: '#FFFFFF',
    },
  };

  // /***********************
  //  ***********************
  //  ***   QUIL CONFIG  ***
  //  ***********************
  //  **********************/
  quillConfig = QUILL_CONFIG_READ_ONLY;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private deviceDetectorService: DeviceDetectorService,
    private languageService: LanguageService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private titleService: Title,
    private toastr: ToastrService
  ) {}

  @Input() viewMode: ViewMode = LANGUAGE_VIEW_MODES.PREVIEW;

  ngOnInit(): void {
    /** spinner starts on init */
    this.spinner.show();

    // Check for max window size
    this.bpoSubscription = this.breakpointObserver
      .observe([`(max-width: ${MIN_WINDOW_SIZE}px)`])
      .subscribe((state) => {
        this.isMobileView = state.matches;
      });

    if (!this.isMobileView) {
      // Detecting if the user is on a mobile device
      this.isMobileView = this.deviceDetectorService.isMobile();
    }

    this.activatedRoute.params.subscribe((params: Params) => {
      // Assign User Object using query param
      const languageId = params['languageId'];
      const currentPath = window.location.pathname;

      // Determine view mode based on the current route
      if (currentPath.includes(APP_ROUTES.VIEW_LANGUAGE.path)) {
        // Public view route (/view)
        this.updateViewMode(LANGUAGE_VIEW_MODES.PUBLIC);
      } else if (currentPath.includes(APP_ROUTES.PREVIEW_LANGUAGE.path)) {
        // Preview route (/preview)
        this.updateViewMode(LANGUAGE_VIEW_MODES.PREVIEW);
      } else {
        // Default to preview mode for any other route
        this.updateViewMode(LANGUAGE_VIEW_MODES.PREVIEW);
      }

      if (this.isPublicMode) {
        this.languageService
          .getPublicLanguage(languageId)
          .subscribe((response: any) => {
            if (response.status === SUCCESS_STATUS && response.data) {
              this.language = response.data as LanguageView;

              if (this.language) {
                this.initializePageView(this.language);
              }
            }

            if (!this.language) {
              // Redirect to 404 page if language not found or no language data due to language not being public
              this.router.navigate([APP_ROUTES.ERROR_PAGE_NOT_FOUND.path]);
            }
          });
      } else {
        this.languageService
          .getLanguageView(languageId)
          .subscribe((response: any) => {
            if (response.status === SUCCESS_STATUS && response.data) {
              this.language = response.data as LanguageView;

              if (this.language) {
                this.initializePageView(this.language);
              }
            }
          });
      }
    });

    /** spinner ends after loading */
    this.spinner.hide();
    this.loading = false;
  }

  ngOnDestroy() {
    this.bpoSubscription.unsubscribe();
    this.browserSubscription.unsubscribe();
  }

  initializePageView(language: LanguageView) {
    this.titleService.setTitle(language.name);
    this.showLanguageFlag = language.viewSettings?.includeLanguageFlag;
    this.languageViewSettings = {
      ...language.viewSettings,
    };
  }

  updateView(view: string) {
    this.currentView = view;
  }

  updateViewMode(newView: ViewMode) {
    this.viewMode = newView;
    this.isPublicMode = this.viewMode === LANGUAGE_VIEW_MODES.PUBLIC;
    this.isPreviewMode = this.viewMode === LANGUAGE_VIEW_MODES.PREVIEW;
    this.isEditMode = this.viewMode === LANGUAGE_VIEW_MODES.EDIT;
  }

  toggleCustomizeStylesDrawer(showCustomizeStylesDrawer: boolean) {
    this.isCustomizeStylesDrawerOpen =
      this.isCustomizeStylesDrawerOpen === showCustomizeStylesDrawer
        ? !showCustomizeStylesDrawer
        : showCustomizeStylesDrawer;
  }

  toggleFlag(event: boolean) {
    this.showLanguageFlag = event;
  }

  toggleHiddenLanguageSections(updatedHiddenSections: string[]) {
    // Update the language view settings with the new hidden sections
    this.languageViewSettings.hiddenSections = updatedHiddenSections;
  }

  toggleCustomTheme(event: boolean) {
    this.showCustomTheme = event;
  }

  saveLanguageViewSettings(isSavingCustomStylesSettings: boolean) {
    try {
      this.languageService
        .updateLanguageViewSettings(
          this.language?.id,
          this.languageViewSettings
        )
        .subscribe((response: any) => {
          if (response.status === SUCCESS_STATUS && response.data) {
            this.language = response.data as LanguageView;
            this.toastr.success(
              `${
                isSavingCustomStylesSettings
                  ? 'Custom styles settings'
                  : 'Language overview settings'
              } successfully updated!`
            );

            if (this.language) {
              this.initializePageView(this.language);
            }

            this.toggleCustomizeStylesDrawer(false);
          }
        });
    } catch (error) {
      this.toastr.error('There was an error saving the language settings.');
    }
  }
}
