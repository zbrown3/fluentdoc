import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  NgClass,
  NgFor,
  NgOptimizedImage,
  DatePipe,
  ViewportScroller,
  NgStyle,
} from '@angular/common';
import { Router } from '@angular/router';
import { ViewLanguageSectionComponent } from '../view-language-section/view-language-section.component';
import { SlugifyPipe } from '../../common/pipes/slugify-pipe';
import { EllipsisComponent } from '../../../components/ellipsis/ellipsis.component';
import { PROFILE_IMAGE_BACKGROUND_DEFAULT } from '../../../utils/constants';
import { MadeWithFluentDocComponent } from '../../../components/made-with-fd/made-with-fd.component';
import { BaseViewSection, type LanguageView } from '../../../utils/types';
import { getLanguageTypeById } from '../../../utils/utils';

@Component({
  selector: 'app-view-language-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DatePipe,
    EllipsisComponent,
    MadeWithFluentDocComponent,
    NgClass,
    NgFor,
    NgOptimizedImage,
    SlugifyPipe,
    ViewLanguageSectionComponent,
    NgStyle,
  ],
  providers: [SlugifyPipe],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnChanges {
  activeSectionId?: string | null = '';
  hiddenSections: string[] = [];
  editMode: boolean = false;
  previewMode: boolean = true;
  publicMode: boolean = false;

  constructor(
    private viewport: ViewportScroller,
    private router: Router,
    private slugifyPipe: SlugifyPipe
  ) {}

  @Input() isCustomizeStylesDrawerOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() isMobileView: boolean = false;
  @Input() isPreviewMode: boolean = true;
  @Input() isPublicMode: boolean = false;
  @Input() language?: LanguageView;
  @Input() showLanguageFlag?: boolean = true;
  @Output() closeCustomizeStylesDrawerEvent = new EventEmitter<boolean>();
  @Output() toggleHiddenLanguageSectionsEvent = new EventEmitter<string[]>();

  ngOnInit(): void {
    this.viewport.setOffset([0, 80]);

    this.hiddenSections = this.language?.viewSettings?.hiddenSections || [];
    this.editMode = this.isEditMode;
    this.previewMode = this.isPreviewMode;
    this.publicMode = this.isPublicMode;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEditMode']) {
      this.editMode = changes['isEditMode'].currentValue;
    }

    if (changes['isPreviewMode']) {
      this.previewMode = changes['isPreviewMode'].currentValue;
    }

    if (changes['isPublicMode']) {
      this.publicMode = changes['isPublicMode'].currentValue;
    }

    if (changes['language']) {
      this.hiddenSections =
        changes['language'].currentValue.viewSettings?.hiddenSections || [];
    }

    if (changes['showLanguageFlag']) {
      this.showLanguageFlag = changes['showLanguageFlag'].currentValue;
    }
  }

  getLanguageType(typeId: string) {
    const languageType = getLanguageTypeById(typeId);

    return languageType?.type;
  }

  goToSection(sectionId?: string | null) {
    this.activeSectionId = sectionId;
    const fragment = this.slugifyPipe.transform(sectionId);
    let currentUrl = this.router.url;

    if (currentUrl.includes('#')) {
      currentUrl = currentUrl.split('#')[0] + '#' + fragment;
    } else {
      currentUrl += '#' + fragment;
    }

    this.router.navigateByUrl(currentUrl);
  }

  closeCustomizeStylesDrawer() {
    this.closeCustomizeStylesDrawerEvent.emit(false);
  }

  getIsSectionHidden(sectionKey?: string | null): boolean {
    if (!sectionKey) {
      return false;
    }

    return this.hiddenSections.includes(sectionKey);
  }

  toggleHiddenLanguageSections(
    sectionKey: string | null = '',
    isSectionToggled: boolean = false,
    subsectionKey: string | null = null,
    subsections: BaseViewSection[] | null = null
  ) {
    if (!sectionKey) return;

    // Helper to get all subsection titles
    const subsectionTitles = (subsections ?? [])
      .map((sub) => sub.title)
      .filter((title): title is string => !!title);

    if (isSectionToggled) {
      // Toggle main section and all its subsections
      if (this.hiddenSections.includes(sectionKey)) {
        // Unhide section and all subsections
        this.hiddenSections = this.hiddenSections.filter(
          (key) => key !== sectionKey && !subsectionTitles.includes(key)
        );
      } else {
        // Hide section and all subsections
        this.hiddenSections = [
          ...this.hiddenSections.filter(
            (key) => key !== sectionKey && !subsectionTitles.includes(key)
          ),
          sectionKey,
          ...subsectionTitles,
        ];
      }
    } else if (subsectionKey && subsections) {
      // Toggle only subsection
      if (this.hiddenSections.includes(subsectionKey)) {
        // Unhide subsection
        this.hiddenSections = this.hiddenSections.filter(
          (key) => key !== subsectionKey
        );
      } else {
        // Hide subsection
        this.hiddenSections = [...this.hiddenSections, subsectionKey];
      }

      // After toggling, check how many subsections are hidden
      const hiddenSubsectionsCount = subsectionTitles.filter((title) =>
        this.hiddenSections.includes(title)
      ).length;

      if (hiddenSubsectionsCount === subsectionTitles.length) {
        // All subsections hidden, hide parent section
        if (!this.hiddenSections.includes(sectionKey)) {
          this.hiddenSections = [...this.hiddenSections, sectionKey];
        }
      } else if (hiddenSubsectionsCount === 0) {
        // All subsections visible, unhide parent section
        this.hiddenSections = this.hiddenSections.filter(
          (key) => key !== sectionKey
        );
      } else {
        // Some subsections hidden, some visible
        // Parent section must be visible if any subsection is visible
        this.hiddenSections = this.hiddenSections.filter(
          (key) => key !== sectionKey
        );
      }
    }

    // Emit the updated hidden sections
    this.toggleHiddenLanguageSectionsEvent.emit(this.hiddenSections);
  }

  protected readonly BACKGROUND_COLOR_DEFAULT = PROFILE_IMAGE_BACKGROUND_DEFAULT;
}
