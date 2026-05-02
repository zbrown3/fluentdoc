import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SlugifyPipe } from '../../../common/pipes/slugify-pipe';
import { ALPHABET } from '../../../common/utils/constants';
import { Phrase } from '../../../../utils/types';

@Component({
  selector: 'app-view-language-phrases-view-section',
  standalone: true,
  imports: [NgFor, NgIf, SlugifyPipe],
  providers: [SlugifyPipe],
  templateUrl: './phrase-view-section.component.html',
  styleUrls: ['./phrase-view-section.component.scss'],
})
export class PhrasesSectionComponent {
  dictionaryKeys = ALPHABET;
  phrases: { [key: string]: any } = {};

  constructor() {}

  @Input() listKey: string = '';
  @Input() listByKey?: Phrase[] = [];
}
