import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SlugifyPipe } from '../../../common/pipes/slugify-pipe';
import { ALPHABET } from '../../../common/utils/constants';
import { VocabularyWord } from '../../../../utils/types';

@Component({
  selector: 'app-view-language-dictionary-view-section',
  standalone: true,
  imports: [NgFor, NgIf, SlugifyPipe],
  providers: [SlugifyPipe],
  templateUrl: './dictionary-view-section.component.html',
  styleUrls: ['./dictionary-view-section.component.scss'],
})
export class DictionarySectionComponent {
  dictionaryKeys = ALPHABET;
  dictionary: { [key: string]: any } = {};

  constructor() {}

  @Input() listKey: string = '';
  @Input() listByKey?: VocabularyWord[] = [];
}
