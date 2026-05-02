import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { SanitizeHtmlPipe } from '../../common/pipes/sanitize-html-pipe';
import { LANGUAGE_SUBSECTIONS } from '../../common/utils/constants';
import { AlphabetPreviewComponent } from '../../language/includes/alphabet/alphabet-preview/alphabet-preview.component';
import { ConsonantsPreviewComponent } from '../../language/includes/consonants/consonants-preview/consonants-preview.component';
import { VowelChartPreviewComponent } from '../../language/includes/vowels/vowel-chart-preview/vowel-chart-preview.component';
@Component({
  selector: 'app-view-language-section',
  standalone: true,
  imports: [
    ConsonantsPreviewComponent,
    NgClass,
    SanitizeHtmlPipe,
    AlphabetPreviewComponent,
    VowelChartPreviewComponent,
  ],
  providers: [],
  templateUrl: './view-language-section.component.html',
  styleUrls: ['./view-language-section.component.scss'],
})
export class ViewLanguageSectionComponent {
  constructor() {}

  @Input() isSubsection: boolean = false;
  @Input() sectionId?: string = '';
  @Input() sectionTitle?: string | null = undefined;
  @Input() sectionSubtitle?: string | null = undefined;
  @Input() sectionContent?: string | null = undefined;
  @Input() showSection: boolean = true;
  @Input() hasTable?: boolean = false;
  @Input() tableData?: Record<string, unknown> | null = null;
  protected readonly LANGUAGE_SUBSECTIONS = LANGUAGE_SUBSECTIONS;
}
