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
import { VocabularyWord } from '../../../utils/types';
import { filterDictionaryBySearchTerm } from '../../../utils/utils';
import { DictionarySectionComponent } from './dictionary-view-section/dictionary-view-section.component';

@Component({
  selector: 'app-view-language-dictionary-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, NgFor, DictionarySectionComponent, FormsModule],
  providers: [SlugifyPipe],
  templateUrl: './dictionary-view.component.html',
  styleUrls: ['./dictionary-view.component.scss'],
})
export class DictionaryComponent implements OnInit, OnChanges {
  dictionaryKeys = ALPHABET;
  fullDictionary: { [key: string]: VocabularyWord[] } = {};
  filteredDictionary: { [key: string]: VocabularyWord[] } = {};
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
  @Input() vocabulary?: any = [];

  ngOnInit(): void {
    this.viewport.setOffset([0, 185]);

    // Always initialize the dictionary, even if empty
    this.fullDictionary = ALPHABET.reduce(
      (acc: { [key: string]: any }, letter: string) => {
        acc[letter] = this.vocabulary
          .filter((wordObj: any) => {
            return wordObj.word.toLowerCase().startsWith(letter.toLowerCase());
          })
          .sort((a: any, b: any) => a.word.localeCompare(b.word));

        return acc;
      },
      {}
    );

    // Initialize filteredDictionary with the full dictionary
    this.filteredDictionary = { ...this.fullDictionary };
  }

  // Event fired when the value to the Input() variables has changed
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isMobileView']) {
      this.searchPlaceholder = changes['isMobileView'].currentValue
        ? 'Search words'
        : 'Search words, meanings, pronunciation, notes...';
    }
  }

  onSearchTermChange(searchString: string): void {
    this.filteredDictionary = filterDictionaryBySearchTerm(
      this.fullDictionary,
      this.dictionaryKeys,
      searchString,
      (wordObj: VocabularyWord) => {
        // Search across all fields: word, meaning, pronunciation, notes, pos
        const searchableText = [
          wordObj.word,
          wordObj.meaning,
          wordObj.pronunciation,
          wordObj.notes,
          wordObj.pos,
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
