import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgClass, NgFor, ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlugifyPipe } from '../../common/pipes/slugify-pipe';
import { ALPHABET } from '../../common/utils/constants';
import { Phrase } from '../../../utils/types';
import { filterDictionaryBySearchTerm } from '../../../utils/utils';
import { PhrasesSectionComponent } from './phrase-view-section/phrase-view-section.component';

@Component({
  selector: 'app-view-language-phrases-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, NgFor, PhrasesSectionComponent, FormsModule],
  providers: [SlugifyPipe],
  templateUrl: './phrases.component.html',
  styleUrls: ['./phrases.component.scss'],
})
export class PhrasesComponent implements OnInit, OnChanges {
  viewTitle: string = '';
  dictionaryKeys = ALPHABET;
  fullPhrasesDictionary: { [key: string]: Phrase[] } = {};
  filteredPhrases: { [key: string]: Phrase[] } = {};
  activeSectionId?: string | null = '';
  searchTerm: string = '';
  searchPlaceholder: string = '';

  constructor(
    private viewport: ViewportScroller,
    private router: Router,
    private slugifyPipe: SlugifyPipe
  ) {}

  @Input() isEditMode: boolean = false;
  @Input() isMobileView: boolean = false;
  @Input() isPreviewMode: boolean = true;
  @Input() isPublicMode: boolean = false;
  @Input() languageName?: string = '';
  @Input() phrases?: any = [];

  ngOnInit(): void {
    this.viewport.setOffset([0, 185]);

    if (this.isMobileView) {
      this.searchPlaceholder = 'Search phrases';
    }

    // Always initialize the dictionary, even if empty
    this.fullPhrasesDictionary = ALPHABET.reduce(
      (acc: { [key: string]: any }, letter: string) => {
        acc[letter] = this.phrases
          .filter((phraseObj: Phrase) => {
            return phraseObj.phrase
              .toLowerCase()
              .startsWith(letter.toLowerCase());
          })
          .sort((a: any, b: any) => a.phrase.localeCompare(b.phrase));

        return acc;
      },
      {}
    );

    // Initialize filteredPhrases with the full phrases dictionary
    this.filteredPhrases = { ...this.fullPhrasesDictionary };
  }

  // Event fired when the value to the Input() variables has changed
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isMobileView']) {
      this.searchPlaceholder = changes['isMobileView'].currentValue
        ? 'Search phrases'
        : 'Search phrases, meanings, pronunciation, notes...';
    }
  }

  onSearchTermChange(searchString: string): void {
    this.filteredPhrases = filterDictionaryBySearchTerm(
      this.fullPhrasesDictionary,
      this.dictionaryKeys,
      searchString,
      (phraseObj: Phrase) => {
        // Search across all fields: phrase, meaning, pronunciation, notes
        const searchableText = [
          phraseObj.phrase,
          phraseObj.meaning,
          phraseObj.pronunciation,
          phraseObj.notes,
        ]
          .join(' ')
          .toLowerCase();

        return searchableText;
      }
    );
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
}
