import { Component, OnInit, Input } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

import { ALL_CONSONANTS } from '../../../../common/utils/consonants-grid-constants';

@Component({
  selector: 'app-consonants-preview',
  standalone: true,
  imports: [NgClass, NgFor],
  providers: [],
  templateUrl: './consonants-preview.component.html',
  styleUrls: ['./consonants-preview.component.scss'],
})
export class ConsonantsPreviewComponent implements OnInit {
  consonantsByType: { [type: string]: any[] } = {};
  tablesByConsonantType: string[] = [];
  selectedConsonants: string[] = [];

  @Input() consonantsData?: Record<string, unknown> | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.consonantsData) {
      this.selectedConsonants = Object.keys(this.consonantsData).filter(
        (key) => (this.consonantsData as Record<string, unknown>)[key] === true
      );

      this.consonantsByType = Object.keys(ALL_CONSONANTS).reduce((acc, key) => {
        const consonant = ALL_CONSONANTS[key as keyof typeof ALL_CONSONANTS];

        // only include selected consonants
        if (this.selectedConsonants.includes(key)) {
          if (!acc[consonant.type]) {
            acc[consonant.type] = [];
          }

          acc[consonant.type].push(consonant);
        }

        return acc;
      }, {} as { [type: string]: any[] });

      this.tablesByConsonantType = Object.keys(this.consonantsByType);
    }
  }
}
