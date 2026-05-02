import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FileUploadModule } from 'ng2-file-upload';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProgressbarModule, ProgressbarType } from 'ngx-bootstrap/progressbar';
import { ToastrService } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ChecklistProgressService } from '../services/checklist-progress-service/checklist-progress.service';
import { IntroService } from '../services/intro-service/intro.service';
import { LanguageService } from '../services/language-service/language.service';
import { UserService } from '../services/user-service/user.service';
import { UtilityService } from '../services/util-service/utility.service';

import { AchievementModalComponent } from '../../components/achievement-modal/achievement-modal.component';
import { AlphabetComponent } from './includes/alphabet/include.alphabet';
import { ConsonantComponent } from './includes/consonants/include.consonants';
import { EditLanguageHeaderComponent } from './edit-language-header/edit-language-header.component';
import { FtuChecklistFabComponent } from '../../components/ftu-checklist-fab/ftu-checklist-fab.component';
import { GeneralInfoComponent } from './includes/general-info/general-info.component';
import { IpaQuillEditorComponent } from '../../components/ipa-quill-editor/ipa-quill-editor.component';
import { LanguageFlagComponent } from './includes/language-flag/language-flag.component';
import { LanguageSettingsComponent } from './includes/language-settings/language-settings.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { PhraseComponent } from './includes/phrases/include.phrases';
import { SentenceStructureComponent } from './includes/sentence-structure/sentence-structure.component';
import { StoryComponent } from '../story/story.component';
import { VocabComponent } from './includes/vocab/include.vocab';
import { VowelComponent } from './includes/vowels/include.vowels';
import { WordGeneratorComponent } from './includes/word-generator/word-generator.component';

import { SortPipe } from '../common/pipes/sort-pipe';
import {
  BS_MODAL_CONFIG,
  LANGUAGE_SECTIONS,
  LANGUAGE_SUBSECTIONS,
  SUCCESS_STATUS,
  VIEW_LANGUAGE,
  VIEW_STORY,
} from '../common/utils/constants';
import {
  CHECKLIST_TYPES,
  PLACEHOLDER_INTRO,
  PLAN_TYPES,
  PRIVACY_LEVELS,
  SHOW_LANGUAGE_TOUR,
} from '../../utils/constants';
import { ApiResponse } from '../../utils/types';

export interface PlanLimits {
  languages: number;
  words: number;
  phrases: number;
  ai_flag_generation: AiFlagGenerationLimits;
}

export interface AiFlagGenerationLimits {
  maxUsage: number;
  interval: 'monthly' | 'weekly';
}

export interface PlanUsage {
  languages: number;
  words: number;
  phrases: number;
  ai_flag_generation: {
    used: number;
    lastReset: string;
  };
}

export interface Language {
  id: string;
  name: string;
  [key: string]: any; // Allow any extra fields (catch-all)
}

export interface LanguageViewResponse {
  language: Language;
  limits: PlanLimits;
  usage: PlanUsage;
}

export type LanguageViewApiResponse = ApiResponse<LanguageViewResponse>;

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [
    AlphabetComponent,
    ConsonantComponent,
    EditLanguageHeaderComponent,
    FileUploadModule,
    FormsModule,
    FtuChecklistFabComponent,
    GeneralInfoComponent,
    IpaQuillEditorComponent,
    LanguageFlagComponent,
    LoadingSpinnerComponent,
    NgClass,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    PhraseComponent,
    ProgressbarModule,
    ReactiveFormsModule,
    SentenceStructureComponent,
    SortPipe,
    StoryComponent,
    TooltipModule,
    VocabComponent,
    VowelComponent,
    WordGeneratorComponent,
  ],
  providers: [
    UserService,
    LanguageService,
    UtilityService,
    IntroService,
    ChecklistProgressService,
  ],
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {
  loading = true;
  saving: string | null = null;

  // Feature flags
  isLanguageSharingEnabled = true;

  // Page display variables
  loadingPage: boolean = true;
  activeLink: string = LANGUAGE_SUBSECTIONS.mainInformation.name;
  activeSection: string = LANGUAGE_SUBSECTIONS.mainInformation.section;
  hoveredSubSection: string | null = null;

  // object refs
  language: any = {};
  editLanguage: any = {};
  collaborator: any;
  honorificInput: string = '';

  // limits and usage
  limits!: PlanLimits;
  usage!: PlanUsage;
  planType: string = PLAN_TYPES.FOUNDING_CREATOR;
  isOnStarterPlan: boolean = false;

  // switches
  honorificsShow: any;
  honorificsOption: boolean = false;

  // consonant object
  // from http://www.antimoon.com/how/pronunc-ascii.htm
  consonants: any = {};
  consonantArray: any = [];

  // vowel object
  // from http://www.antimoon.com/how/pronunc-ascii.htm
  vowels: any = {};
  vowelArray: any = [];

  // local reference objects
  phrases: any = {};
  alphabet: any = {};

  // checklist progress
  gettingStartedStepsCompleted: boolean = false;
  gettingStartedSteps: any;

  constructor(
    private userService: UserService,
    private languageService: LanguageService,
    private utilityService: UtilityService,
    private router: Router,
    private toastr: ToastrService,
    private checklistProgressService: ChecklistProgressService,
    private activatedRoute: ActivatedRoute,
    protected bsModalRef: BsModalRef,
    private titleService: Title,
    protected bsModalService: BsModalService,
    private spinner: NgxSpinnerService,
    private cdRef: ChangeDetectorRef,
    private introService: IntroService,
  ) {}

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    // Assign Language Id
    this.activatedRoute.params.subscribe((params: Params) => {
      // Assign User Object using query param
      const languageId = params['languageId'];
      this.userService
        .getLanguage(languageId)
        .subscribe((response: LanguageViewApiResponse) => {
          // set storage information for current language
          localStorage.setItem('languageId', params['languageId']);
          const { language, limits, usage } = response.data;

          // assign found language object to local language object
          this.language = language;
          this.limits = limits;
          this.usage = usage;

          // set title to language name
          this.titleService.setTitle(this.language.name);

          // assign a copy of language object to temp edit language for editing
          this.editLanguage = { ...this.language };

          // assign a copy of consonants to local consonants object
          this.consonants = { ...this.language.consonants };
          this.initializeConsonantArray();

          // assign a copy of vowels to local consonants object
          this.vowels = { ...this.language.vowels };
          this.initializeVowelArray();

          // assign a copy of alphabet to local alphabet object
          this.alphabet = { ...this.language.alphabet };

          // assign honorifics variable
          this.honorificsShow = false;

          // if honorifics is set to 'NoHonorificData', set input to empty string
          if (
            this.language.honorifics === 'NoHonorificsData' ||
            this.language.honorifics === null
          ) {
            this.honorificInput = '';
          } else {
            this.honorificInput = this.language.honorifics;
          }

          // assign copy of phrases to local phrases object
          this.phrases = { ...this.language.phrases };

          // load page (RESOLVE Asynchronous issue)
          this.loadingPage = false;
          // If no language data, go to dashboard (desktop app: no auth)
          if (!this.language) {
            this.router.navigate(['/dashboard']);
          }

          const userId = localStorage.getItem('userId');
          if (userId) {
            this.checklistProgressService
              .getChecklistProgress(userId)
              .subscribe((checklist) => {
                if (checklist.status === SUCCESS_STATUS) {
                  this.gettingStartedStepsCompleted =
                    checklist.data['completedCount'] ===
                    checklist.data['totalCount'];
                  this.gettingStartedSteps = checklist.data['steps'] || [];
                } else {
                  console.warn('Error getting checklist progress steps');
                }
              });
          }

          /** spinner ends after loading */
          this.spinner.hide();
          this.loading = false;

          // show tour if user is new
          const showTour = localStorage.getItem(SHOW_LANGUAGE_TOUR);
          if (showTour === 'true') {
            setTimeout(() => {
              this.introService.startLanguageTour();
              localStorage.setItem(SHOW_LANGUAGE_TOUR, 'false');
            }, 500); // delay to ensure DOM has fully rendered
          }
        });
    });
  }

  /***********************
   ***********************
   ***      SWITCH     ***
   ***********************
   **********************/
  view: string = VIEW_LANGUAGE;

  switchView() {
    this.view = this.view === VIEW_LANGUAGE ? VIEW_STORY : VIEW_LANGUAGE;
  }

  /***********************
   ***********************
   ***   PINNED PAGES  ***
   ***********************
   **********************/

  isPinnedSection(name: string) {
    return this.editLanguage.pinnedSections.some(
      (section: { name: string }) => section.name === name
    );
  }

  handlePinSection(
    order: number,
    name: string,
    section: string,
    title: string
  ) {
    const sectionObject = {
      order: order,
      name: name,
      section: section,
      title: title,
    };
    // update edit languages pinned section array with new section
    // add if not already in array
    if (this.isPinnedSection(name)) {
      this.editLanguage.pinnedSections =
        this.editLanguage.pinnedSections.filter(
          (section: { name: string }) => section.name !== name
        );
    } else {
      this.editLanguage.pinnedSections.push(sectionObject);
      // sort by order
      this.editLanguage.pinnedSections.sort(
        (a: { order: number }, b: { order: number }) => a.order - b.order
      );
    }
    const request = {
      pinnedSections: this.editLanguage.pinnedSections,
    };
    this.languageService
      .updatePinnedSections(this.language.id, request)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            // update language with response
            this.language.pinnedSections = this.editLanguage.pinnedSections;
            this.toastr.success('Pinned Section Updated Successfully');
          } else {
            this.toastr.error(
              'There was an issue updating your pinned section. Please try again later.'
            );
          }
        },
      });
  }

  getPinnedSectionTitle(name: string) {
    let title = '';
    Object.values(LANGUAGE_SECTIONS).forEach(
      (section: { name: string; title: string }) => {
        if (section.name === name) {
          title = section.title;
        }
      }
    );
    return title;
  }

  /***********************
   ***********************
   ***   PAGE DISPLAY  ***
   ***********************
   **********************/

  // progress bar display
  getLanguageProgressPercentage() {
    const functionsToCheck = [
      this.mainInfoComplete(),
      this.introComplete(),
      this.flagComplete(),
      this.consonantsComplete(),
      this.vowelsComplete(),
      this.diphthongsComplete(),
      this.alphabetComplete(),
      this.stressComplete(),
      this.vowelHarmonyComplete(),
      this.honorificsComplete(),
      this.verbsComplete(),
      this.sentenceStructureComplete(),
      this.negationComplete(),
      this.questionFormingComplete(),
      this.vocabComplete(),
      this.phrasesComplete(),
    ];

    let result = 0;
    functionsToCheck.forEach(function (isComplete) {
      if (isComplete) {
        result = result + 1;
      }
    });

    return Math.trunc((result / functionsToCheck.length) * 100);
  }

  getProgressBarDisplayColor(): ProgressbarType {
    return 'success';
  }

  // ACTIVE LINK
  setActiveLink(link: string, section: string) {
    this.activeLink = link;
    this.activeSection = section;
  }

  isSubSectionComplete(subSection: string) {
    switch (subSection) {
      case LANGUAGE_SUBSECTIONS.mainInformation.name:
        return this.mainInfoComplete();
      case LANGUAGE_SUBSECTIONS.introduction.name:
        return this.introComplete();
      case LANGUAGE_SUBSECTIONS.languageFlag.name:
        return this.flagComplete();
      case LANGUAGE_SUBSECTIONS.contributors.name:
        return true;
      case LANGUAGE_SUBSECTIONS.consonants.name:
        return this.consonantsComplete();
      case LANGUAGE_SUBSECTIONS.vowels.name:
        return this.vowelsComplete();
      case LANGUAGE_SUBSECTIONS.diphthongs.name:
        return this.diphthongsComplete();
      case LANGUAGE_SUBSECTIONS.alphabet.name:
        return this.alphabetComplete();
      case LANGUAGE_SUBSECTIONS.stress.name:
        return this.stressComplete();
      case LANGUAGE_SUBSECTIONS.phonotactics.name:
        return this.phonotacticsComplete();
      case LANGUAGE_SUBSECTIONS.vowelHarmony.name:
        return this.vowelHarmonyComplete();
      case LANGUAGE_SUBSECTIONS.honorifics.name:
        return this.honorificsComplete();
      case LANGUAGE_SUBSECTIONS.verbs.name:
        return this.verbsComplete();
      case LANGUAGE_SUBSECTIONS.sentenceStructure.name:
        return this.sentenceStructureComplete();
      case LANGUAGE_SUBSECTIONS.negation.name:
        return this.negationComplete();
      case LANGUAGE_SUBSECTIONS.questionForming.name:
        return this.questionFormingComplete();
      case LANGUAGE_SUBSECTIONS.vocabulary.name:
        return this.vocabComplete();
      case LANGUAGE_SUBSECTIONS.phrases.name:
        return this.phrasesComplete();
      case LANGUAGE_SUBSECTIONS.numberSystem.name:
        return this.numeralSystemComplete();
      default:
        return '';
    }
  }

  // get subsections for language section
  getSubsections(section: string) {
    return Object.values(LANGUAGE_SUBSECTIONS).filter((obj) => {
      return obj.section === section;
    });
  }

  // mainInfo complete
  mainInfoComplete() {
    return (
      this.language.name !== null ||
      this.language.name !== '' ||
      this.language.description !== null ||
      this.language.description !== ''
    );
  }

  // introduction complete
  introComplete() {
    return (
      this.language.introduction !== null && this.language.introduction !== ''
    );
  }

  // flag complete
  flagComplete() {
    return this.language.flagUrl !== null && this.language.flagUrl !== '';
  }

  consonantsComplete() {
    let result = false;

    // if there are any values
    // iterate through values
    if (this.language.consonants) {
      // if any values are true, return true
      for (const key in this.language.consonants) {
        if (this.language.consonants[key]) {
          result = true;
        }
      }
    }

    return result;
  }

  vowelsComplete() {
    let result = false;

    // if there are any values
    // iterate through values
    if (this.language.vowels) {
      // if any values are true, return true
      for (const key in this.language.vowels) {
        if (this.language.vowels[key]) {
          result = true;
        }
      }
    }

    return result;
  }

  diphthongsComplete() {
    return this.language.diphthongs != null;
  }

  alphabetComplete() {
    return this.language.alphabet != null && this.language.alphabet !== '';
  }

  stressComplete() {
    return this.language.stress != null && this.language.stress !== '';
  }

  phonotacticsComplete() {
    return (
      this.language.phonologicalConstraints != null &&
      this.language.phonologicalConstraints !== ''
    );
  }

  vowelHarmonyComplete() {
    return (
      this.language.vowelHarmony != null && this.language.vowelHarmony !== ''
    );
  }

  honorificsComplete() {
    return this.language.honorifics != null;
  }

  verbsComplete() {
    return this.language.conjugation != null;
  }

  sentenceStructureComplete() {
    return this.language.syntax != null && this.language.wordOrder != null;
  }

  negationComplete() {
    return this.language.negation != null;
  }

  questionFormingComplete() {
    return this.language.questionFormingInfo != null;
  }

  vocabComplete() {
    return this.language.vocab != null && this.language.vocab.length > 0;
  }

  phrasesComplete() {
    return this.language.phrases != null && this.language.phrases.length > 0;
  }

  // Number System -------------------- //
  numeralSystemComplete() {
    return (
      this.language.numeralDescription != null ||
      this.language.baseNumber != null ||
      (this.language.numerals != null && this.language.numerals.length > 0)
    );
  }

  /***********************
   ***********************
   *        FORMAT       *
   ***********************
   **********************/
  formatDynamicString(description: string, repr: string) {
    return this.utilityService.formatDynamicString(description, repr);
  }

  /***********************
   ***********************
   *** EXPORT DOCUMENT ***
   ***********************
   **********************/

  updateLanguagePrivacyLevel(updatedLanguage: Language) {
    this.language = updatedLanguage;
  }

  updateLanguageExportedChecklistStep() {
    // TODO: only make this call if we're in chekclist mode
    if (!this.gettingStartedStepsCompleted) {
      this.markChecklistStepComplete('exportLanguage');
    }
  }

  /***********************
   ***********************
   ***     SETTINGS    ***
   ***********************
   **********************/

  openSettingsModal() {
    const initialState = {
      language: this.language,
    };
    // @ts-expect-error FIXME: bsModalRef is not assignable to type BsModalRef
    this.bsModalRef = this.bsModalService
      .show(LanguageSettingsComponent, Object.assign({ initialState }))
      .onHide.subscribe((result) => {
        if (result === 'save') {
          this.ngOnInit();
        }
      });
  }

  /***********************
   ***********************
   ***      GENERAL    ***
   ***********************
   **********************/

  /**
   * Update General Language Info Section
   * @param generalInfo
   */
  updateLanguageGeneralInfo(generalInfo: any) {
    this.saving = LANGUAGE_SUBSECTIONS.mainInformation.name;

    const generalInfoPayload = {
      ...generalInfo,
    };

    this.languageService
      .updateLanguageGeneralInfo(this.language.id, generalInfoPayload)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            // update editLanguage object
            this.editLanguage = response.data;
            this.handleLanguageUpdateSuccess('general info');
          } else {
            this.handleLanguageUpdateFailure(response, 'general info');
          }
        },
        error: () => {
          this.saving = null;
        },
      });
  }

  // /***********************
  //  ***********************
  //  ***  Introduction   ***
  //  ***********************
  //  **********************/

  /**
   * Update Introduction Section
   */
  updateIntroduction() {
    this.saving = LANGUAGE_SUBSECTIONS.introduction.name;

    const introductionInfo = {
      introduction: this.editLanguage.introduction,
    };
    this.languageService
      .updateLanguageIntroduction(this.language.id, introductionInfo)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            this.handleLanguageUpdateSuccess('Intro');
          } else {
            this.handleLanguageUpdateFailure(response, 'intro');
          }
        },
        error: () => {
          this.saving = null;
        },
      });
  }

  /***********************
   ***********************
   ***  Collaborator   ***
   ***********************
   **********************/

  /**
   * Add Collaborator
   * @param collaborator
   */
  addCollaborator(collaborator: string) {
    const addCollaboratorInfo = {
      name: collaborator,
      action: 'add',
    };
    this.languageService
      .editCollaborators(this.language.id, addCollaboratorInfo)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            this.handleLanguageUpdateSuccess('Collaborators');
            this.editLanguage.collaborators.push(collaborator);
            this.collaborator = null;
          } else {
            this.handleLanguageUpdateFailure(response, 'Collaborators');
          }
        },
        error: () => {
          this.saving = null;
        },
      });
  }

  /**
   * Delete Collaborator
   * @param collaborator
   * @param index
   */
  removeCollaborator(collaborator: any, index: number) {
    const addCollaboratorInfo = {
      name: collaborator,
      action: 'delete',
    };
    this.languageService
      .editCollaborators(this.language.id, addCollaboratorInfo)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            this.handleLanguageUpdateSuccess('Collaborators');
            this.editLanguage.collaborators.splice(index, 1);
          } else {
            this.handleLanguageUpdateFailure(response, 'Collaborators');
          }
        },
        error: () => {
          this.saving = null;
        },
      });
  }

  // /***********************
  //  ***********************
  //  ***   CONSONANTS    ***
  //  ***********************
  //  **********************/

  /**
   * update Consonants
   * @param consonantsObject
   */
  updateConsonants(consonantsObject: any) {
    this.saving = LANGUAGE_SUBSECTIONS.consonants.name;

    const consonantMap = {
      consonants: consonantsObject.consonants,
      description: consonantsObject.description,
    };
    this.languageService
      .updateConsonants(this.language.id, consonantMap)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            // update editLanguage object
            this.editLanguage.consonantsDescription =
              consonantsObject.description;
            this.editLanguage.consonants = consonantsObject.consonants;
            // populate alphabet section with new data
            this.initializeConsonantArray();
            this.handleLanguageUpdateSuccess('Consonants');
          } else {
            this.handleLanguageUpdateFailure(response, 'Consonants');
          }
        },
        error: () => {
          this.saving = null;
        },
      });

    // update step if getting started check list is enabled
    if (!this.gettingStartedStepsCompleted) {
      this.updatePhonologyChecklistStep();
    }
  }

  // initialize Consonant Array
  initializeConsonantArray() {
    // empty consonant array for fresh population
    this.consonantArray = [];
    // if value equals true. show it
    for (const prop in this.editLanguage.consonants) {
      if (this.editLanguage.consonants[prop] === true) {
        // if consonant array doesn't have value, add it
        if (!this.consonantArray.includes(prop)) {
          this.consonantArray.push(this.utilityService.mapToSymbol(prop));
        }
      }
    }
  }

  // /***********************
  //  ***********************
  //  ***     VOWELS      ***
  //  ***********************
  //  **********************/

  /**
   * update Vowels
   * @param vowelsObject
   */
  updateVowels(vowelsObject: any) {
    this.saving = LANGUAGE_SUBSECTIONS.vowels.name;

    const vowelMap = {
      vowels: vowelsObject.vowels,
      description: vowelsObject.description,
    };
    this.languageService.updateVowels(this.language.id, vowelMap).subscribe({
      next: (response) => {
        if (response.status === SUCCESS_STATUS) {
          // update editLanguage object
          this.editLanguage.vowels = vowelsObject.vowels;
          this.editLanguage.vowelsDescription = vowelsObject.description;

          // update vowels object
          this.vowels = vowelsObject.vowels;
          // populate alphabet section with new data
          this.initializeVowelArray();
          this.handleLanguageUpdateSuccess('Vowels');
        } else {
          this.handleLanguageUpdateFailure(response, 'Vowels');
        }
      },
      error: () => {
        this.saving = null;
      },
    });

    // update step if getting started checklist is enabled
    if (!this.gettingStartedStepsCompleted) {
      this.updatePhonologyChecklistStep();
    }
  }

  // Initialize Vowel Array
  initializeVowelArray() {
    // empty vowel array for fresh population
    this.vowelArray = [];
    for (const prop in this.editLanguage.vowels) {
      // add new vowels to array real-time
      if (this.editLanguage.vowels[prop] === true) {
        // if vowel array doesn't have value, add it
        if (!this.vowelArray.includes(prop)) {
          this.vowelArray.push(this.utilityService.mapToSymbol(prop));
        }
      }
    }
  }

  // /***********************
  //  ***********************
  //  ***   DIPHTHONGS    ***
  //  ***********************
  //  **********************/

  /**
   * update Diphthongs
   * @param diphthong
   */
  updateDiphthongs(diphthong: any) {
    this.saving = LANGUAGE_SUBSECTIONS.diphthongs.name;

    const diphthongInfo = {
      diphthongs: diphthong,
    };
    this.languageService
      .updateDiphthongs(this.language.id, diphthongInfo)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            this.handleLanguageUpdateSuccess('Diphthongs');
          } else {
            this.handleLanguageUpdateFailure(response, 'Diphthongs');
          }
        },
        error: () => {
          this.saving = null;
        },
      });

    // update step if getting started check list is enabled
    if (!this.gettingStartedStepsCompleted) {
      this.updatePhonologyChecklistStep();
    }
  }

  /***********************
   ***********************
   ***   ALPHABET      ***
   ***********************
   **********************/

  /**
   * update Alphabet
   * @param alphabet
   */
  updateAlphabet(alphabet: any) {
    this.saving = LANGUAGE_SUBSECTIONS.alphabet.name;

    const alphabetMap = {
      alphabet: alphabet,
    };
    this.languageService
      .updateAlphabet(this.language.id, alphabetMap)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            this.handleLanguageUpdateSuccess('Alphabet');
            this.initializeAlphabetMap(alphabet);
          } else {
            this.handleLanguageUpdateFailure(response, 'Alphabet');
          }
        },
        error: () => {
          this.saving = null;
        },
      });

    // update step if getting started check list is enabled
    if (!this.gettingStartedStepsCompleted) {
      this.updatePhonologyChecklistStep();
    }
  }

  // Initialize Vowel Array
  initializeAlphabetMap(alphabet: any) {
    this.editLanguage.alphabet = alphabet;
    this.language.alphabet = alphabet;
  }

  // /***********************
  //  ***********************
  //  ***   STRESS      ***
  //  ***********************
  //  **********************/

  /**
   * update Stress
   * @param
   */
  updateStress() {
    this.saving = LANGUAGE_SUBSECTIONS.stress.name;

    const stressMap = {
      stress: this.editLanguage.stress,
    };
    this.languageService.updateStress(this.language.id, stressMap).subscribe({
      next: (response) => {
        if (response.status === SUCCESS_STATUS) {
          this.handleLanguageUpdateSuccess('Stress');
        } else {
          this.handleLanguageUpdateFailure(response, 'Stress');
        }
      },
      error: () => {
        this.saving = null;
      },
    });

    // update step if getting started check list is enabled
    if (!this.gettingStartedStepsCompleted) {
      this.updatePhonologyChecklistStep();
    }
  }

  // /***********************
  //  ***********************
  //  ***  CONSTRAINTS    ***
  //  ***********************
  //  **********************/

  /**
   * update Constraints
   * @param
   */
  updateConstraints() {
    this.saving = LANGUAGE_SUBSECTIONS.phonotactics.name;
    const constraintsMap = {
      constraints: this.editLanguage.phonologicalConstraints,
    };
    this.languageService
      .updateConstraints(this.language.id, constraintsMap)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            this.handleLanguageUpdateSuccess('Phonotactics');
          } else {
            this.handleLanguageUpdateFailure(response, 'Phonotactics');
          }
        },
        error: () => {
          this.saving = null;
        },
      });

    // update step if getting started check list is enabled
    if (!this.gettingStartedStepsCompleted) {
      this.updatePhonologyChecklistStep();
    }
  }

  // /***********************
  //  ***********************
  //  ***  VOWEL HARMONY  ***
  //  ***********************
  //  **********************/

  /**
   * update Vowel Harmony
   * @param
   */
  updateVowelHarmony() {
    this.saving = LANGUAGE_SUBSECTIONS.vowelHarmony.name;
    const vowelHarmonyMap = {
      vowelHarmony: this.editLanguage.vowelHarmony,
    };
    this.languageService
      .updateVowelHarmony(this.language.id, vowelHarmonyMap)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            this.handleLanguageUpdateSuccess('VowelHarmony');
          } else {
            this.handleLanguageUpdateFailure(response, 'VowelHarmony');
          }
        },
        error: () => {
          this.saving = null;
        },
      });

    // update step if getting started check list is enabled
    if (!this.gettingStartedStepsCompleted) {
      this.updatePhonologyChecklistStep();
    }
  }

  // /***********************
  //  ***********************
  //  ***    HONORIFICS   ***
  //  ***********************
  //  **********************/

  /**
   * update Honorifics
   * @param
   */
  updateHonorifics() {
    this.saving = LANGUAGE_SUBSECTIONS.honorifics.name;
    // set honorifics option if honorifics data exists and it is unselected
    // NOTE: this had to be done when a user logged back into the system after
    // already entering honorifics data and not explicitly selecting 'yes' or 'no' again
    if (this.honorificsOption === undefined) {
      if (
        ((this.honorificInput === null || this.honorificInput === '') &&
          this.language.honorifics === 'NoHonorificsData') ||
        this.language.honorifics === null
      ) {
        this.honorificsOption = false;
      } else {
        this.honorificsOption = true;
      }
    }

    // if honorificsOption is false, a change was made
    // update language honorifics section to 'NoHonorificsData'
    if (!this.honorificsOption) {
      const honorificData = {
        honorifics: 'NoHonorificsData',
      };
      this.languageService
        .updateHonorifics(this.language.id, honorificData)
        .subscribe({
          next: (response) => {
            if (response.status === SUCCESS_STATUS) {
              this.editLanguage.honorifics = 'NoHonorificsData';
              this.honorificInput = '';
              this.handleLanguageUpdateSuccess('Honorifics');
            } else {
              this.handleLanguageUpdateFailure(response, 'Honorifics');
            }
          },
          error: () => {
            this.saving = null;
          },
        });
    }

    // if honorificsOption is true, a change was made
    // update language honorifics section with honorificInput
    if (this.honorificsOption) {
      const honorificData = {
        honorifics: this.honorificInput,
      };
      this.languageService
        .updateHonorifics(this.language.id, honorificData)
        .subscribe({
          next: (response) => {
            if (response.status === SUCCESS_STATUS) {
              this.editLanguage.honorifics = this.honorificInput;
              this.handleLanguageUpdateSuccess('Honorifics');
            } else {
              this.handleLanguageUpdateFailure(response, 'Honorifics');
            }
          },
          error: () => {
            this.saving = null;
          },
        });
    }
  }

  // set honorifics option
  // (linked to radio buttons 'No' and 'Yes' in Syntax section
  toggleHonorificsOption(value: boolean) {
    this.honorificsOption = value;
    // if value is set to false, set state to 'NoHonorificsData'
    if (!value) {
      this.editLanguage.honorifics = 'NoHonorificsData';
    }
    // show/hide textArea based on selected option
    this.honorificsShow = value;
  }

  // /***********************
  //  ***********************
  //  ***   CONJUGATION   ***
  //  ***********************
  //  **********************/

  /**
   * update Conjugation
   * @param
   */
  updateConjugation() {
    this.saving = LANGUAGE_SUBSECTIONS.verbs.name;

    const conjugationData = {
      conjugation: this.editLanguage.conjugation,
    };
    this.languageService
      .updateConjugation(this.language.id, conjugationData)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            this.handleLanguageUpdateSuccess('Conjugation');
          } else {
            this.handleLanguageUpdateFailure(response, 'Conjugation');
          }
        },
        error: () => {
          this.saving = null;
        },
      });
  }

  // /***********************
  //  ***********************
  //  ***      SYNTAX     ***
  //  ***********************
  //  **********************/

  /**
   * update Negation
   * @param
   */
  updateSyntax(syntaxData: any) {
    this.languageService.updateSyntax(this.language.id, syntaxData).subscribe({
      next: (response) => {
        if (response.status === SUCCESS_STATUS) {
          this.editLanguage.wordOrder = syntaxData.wordOrder;
          this.editLanguage.syntax = syntaxData.syntax;
          this.handleLanguageUpdateSuccess('Syntax');
        } else {
          this.handleLanguageUpdateFailure(response, 'Syntax');
        }
      },
      error: () => {
        this.saving = null;
      },
    });
  }

  // /***********************
  //  ***********************
  //  ***     NEGATION    ***
  //  ***********************
  //  **********************/

  /**
   * update Negation
   * @param
   */
  updateNegation() {
    this.saving = LANGUAGE_SUBSECTIONS.negation.name;
    const negationData = {
      negation: this.editLanguage.negation,
    };
    this.languageService
      .updateNegation(this.language.id, negationData)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            this.handleLanguageUpdateSuccess('Negation');
          } else {
            this.handleLanguageUpdateFailure(response, 'Negation');
          }
        },
        error: () => {
          this.saving = null;
        },
      });
  }

  // /************************
  //  ************************
  //  *** QUESTION FORMING ***
  //  ************************
  //  ***********************/

  /**
   * update Question Forming
   * @param
   */
  updateQuestionForming() {
    this.saving = LANGUAGE_SUBSECTIONS.questionForming.name;

    const questionFormingData = {
      questionFormingInfo: this.editLanguage.questionFormingInfo,
    };
    this.languageService
      .updateQuestionForming(this.language.id, questionFormingData)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            this.handleLanguageUpdateSuccess('Question Forming');
          } else {
            this.handleLanguageUpdateFailure(response, 'Question Forming');
          }
        },
        error: () => {
          this.saving = null;
        },
      });
  }

  // /************************
  //  ************************
  //  ***       VOCAB      ***
  //  ************************
  //  ***********************/

  /**
   * update Vocab
   * @param data
   */
  updateVocab(data: any) {
    const vocabData = {
      vocab: data,
    };
    this.languageService.updateVocab(this.language.id, vocabData).subscribe({
      next: (response) => {
        if (response.status === SUCCESS_STATUS) {
          // update local language object
          this.editLanguage.vocab = data;
          this.handleLanguageUpdateSuccess('Vocab');
        } else {
          this.handleLanguageUpdateFailure(response, 'Vocab');
        }
      },
      error: () => {
        this.saving = null;
      },
    });

    if (!this.gettingStartedStepsCompleted) {
      this.markChecklistStepComplete('createWord');
    }
  }

  // /************************
  //  ************************
  //  *** WORDS & PHRASES  ***
  //  ************************
  //  ***********************/

  /**
   * update Words and Phrases
   * @param
   */
  updateWordsAndPhrases(data: any) {
    const phraseData = {
      phrases: data,
    };
    this.languageService
      .updateWordsAndPhrases(this.language.id, phraseData)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            this.editLanguage.phrases = data;
            this.handleLanguageUpdateSuccess('Words & Phrases');
          } else {
            this.handleLanguageUpdateFailure(response, 'Words & Phrases');
          }
        },
        error: () => {
          this.saving = null;
        },
      });

    if (!this.gettingStartedStepsCompleted) {
      this.markChecklistStepComplete('createPhrase');
    }
  }

  // /************************
  //  ************************
  //  ***   NUMBER SYSTEM  ***
  //  ************************
  //  ***********************/

  /**
   * Update Numeral System for language
   */
  updateNumeralSystem(data: any) {
    const numberSystemData = {
      handler: '',
      numeralDescription: this.language.numeralDescription,
      baseNumber: this.language.baseNumber
        ? this.language.baseNumber.toString()
        : null,
      numerals: this.language.numerals,
    };
    if (data.handler === 'description') {
      numberSystemData.handler = 'description';
      numberSystemData.numeralDescription = data.description;
    } else if (data.handler === 'base') {
      numberSystemData.handler = 'base';
      numberSystemData.baseNumber = data.base;
    } else if (data.handler === 'numerals') {
      numberSystemData.handler = 'numerals';
      numberSystemData.numerals = data.numerals;
    } else {
      // do nothing
    }

    this.languageService
      .updateNumeralSystem(this.language.id, numberSystemData)
      .subscribe({
        next: (response) => {
          if (response.status === SUCCESS_STATUS) {
            // update in-memory language data
            if (data.handler === 'description') {
              this.editLanguage.numeralDescription = data.description;
            }
            if (data.handler === 'base') {
              this.editLanguage.baseNumber = data.base;
            }
            if (data.handler === 'numerals') {
              this.editLanguage.numerals = data.numerals;
            }
            this.handleLanguageUpdateSuccess(
              'Numeral System (' + data.handler + ')'
            );
          } else {
            this.handleLanguageUpdateFailure(
              response,
              'Numeral System (' + data.handler + ')'
            );
          }
        },
        error: () => {
          this.saving = null;
        },
      });
  }

  // /*************************************************
  //  *************************************************
  //  ***  FUNCTIONS, ETC (counters, etc)   ***
  //  *************************************************
  //  *************************************************/

  // Add template Intro to user language for creation
  addCreationIntro() {
    let intro = null;
    intro =
      '<p>A constructed language, or conlang, is a language that is invented by an individual or ' +
      'individuals for communicating. Reasons for inventing a language can include a hobby, a private language ' +
      'to communicate with friends or a language needed for a fiction narrative. It is very often that ' +
      'the creators(s) are the only ones with working knowledge of the language. </p><p><br></p><p>' +
      '<strong>Who can create conlangs? </strong></p><p>Anyone interested enough and willing to take ' +
      'the time to create a language of their own can get started on their way to becoming a conlanger ' +
      '(a person that creates conlangs, of course)! While it might seem as easy as making new phrases ' +
      'and writing them down, creating a well-developed conlang with a true structure and vast bag of ' +
      'words takes plenty of time and patience, as well as thoroughly thought out rules. </p>' +
      '<p><br></p><p>While creating a language, you have to start from the bare bones minimum and ' +
      'work your way up to something complex and sophisticated. When creating a language, you have ' +
      'to start at the sounds allowed in a language (down to is a ‘p’ allowed in the language) and ' +
      'work your way up to word-order of sentences and how negation will work. </p><p><br></p><p>' +
      'With that being said, this book will attempt to cover all aspects of the ' +
      this.editLanguage.name +
      ' Language. ' +
      'Starting from the creation and the development of the language to the grammar rules and ' +
      'interesting facts of the language. </p><p><br></p><p>This guide assumes the reader has at ' +
      'least a basic level understanding of linguistics and linguistic terms. In order to properly ' +
      'digest the information given in this book, terms and concepts associated with syntax, ' +
      'morphology, phonetics, phonology, and grammar should be understood. A good place to start ' +
      'would be with the book Course in General Linguistics by Ferdinand de Saussure.</p>';
    this.editLanguage.introduction = intro;

    // Notify Quill Editor to update
    setTimeout(() => {
      const quillComponent = document.querySelector(
        'app-ipa-quill-editor'
      ) as any;
      if (quillComponent?.quillInstance) {
        quillComponent.quillInstance.root.innerHTML =
          this.editLanguage.introduction;
      }
    }, 100);

    this.cdRef.detectChanges(); // Force Angular to detect the change
  }

  /**
   * Response Handlers!
   * Method for every section to pass through for handling update
   * success & failures
   */
  handleLanguageUpdateSuccess(section: string) {
    this.saving = null;
    // set section to incoming section request on successful update
    // display notifier with success message
    this.toastr.success(section + ' section successfully updated!');
    // update language object
    this.language = { ...this.editLanguage };
  }

  handleLanguageUpdateFailure(response: any, section: string) {
    this.saving = null;
    // display notifier with error message
    this.toastr.error(
      'There was an error updating the ' +
        section +
        ' section. Please try again later.'
    );
  }

  // update phonology section checklist step
  updatePhonologyChecklistStep() {
    if (!this.gettingStartedStepsCompleted) {
      this.markChecklistStepComplete('addPhonology');
    }
  }

  // /*************************************************
  //  *************************************************
  //  ***                  MODALS                   ***
  //  *************************************************
  //  *************************************************/

  openAchievementModal() {
    // close all existing modals
    for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
      this.bsModalService.hide(i);
    }

    // Add a small timeout to ensure a smooth transition
    setTimeout(() => {
      this.bsModalService.show(AchievementModalComponent, {
        ...BS_MODAL_CONFIG,
        class: 'modal-dialog-centered modal-sm',
        initialState: {
          icon: '🎉',
          title: 'Getting started complete!',
          description: 'You’ve completed the checklist – great job!',
          dismissLabel: 'Keep going',
        },
      });
    }, 100);
  }

  markChecklistStepComplete(step: string) {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.checklistProgressService
        .markStepComplete(userId, CHECKLIST_TYPES.GETTING_STARTED, step)
        .subscribe((response) => {
          if (response.status === SUCCESS_STATUS) {
            this.gettingStartedStepsCompleted =
              response.data.completedCount === response.data.totalCount;
            this.gettingStartedSteps = response.data.steps || [];

            // if getting started steps are completed, we can show the achievement modal
            if (this.gettingStartedStepsCompleted) {
              this.openAchievementModal();
            }
          } else {
            console.warn(
              `Error marking ${step} step complete:`,
              response.message
            );
          }
        });
    } else {
      console.warn('User ID is missing — checklist step not recorded');
    }
  }

  copyPublicLinkToClipboard() {
    // copy public link to clipboard
    const publicLink = window.origin + '/view/' + this.language.id;
    this.utilityService.copyToClipboard(publicLink);
    // toastr to let user know value has been copied
    this.toastr.success('Public link copied to clipboard');
  }

  protected readonly LANGUAGE_SECTIONS = LANGUAGE_SECTIONS;
  protected readonly LANGUAGE_VIEW = VIEW_LANGUAGE;
  protected readonly PLACEHOLDER_INTRO = PLACEHOLDER_INTRO;
  protected readonly PRIVACY_LEVELS = PRIVACY_LEVELS;
  protected readonly STORY_VIEW = VIEW_STORY;
  protected readonly SUB_SECTIONS = LANGUAGE_SUBSECTIONS;
}
