import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AlphabetPair {
  letter: string;
  pronunciation: string;
}

@Component({
  selector: 'app-alphabet-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alphabet-preview.component.html',
  styleUrls: ['./alphabet-preview.component.scss'],
})
export class AlphabetPreviewComponent implements OnInit {
  alphabetPairs: AlphabetPair[] = [];
  letters: string[] = [];

  @Input() alphabetData: Record<string, unknown> = {};

  ngOnInit(): void {
    this.letters = Object.keys(this.alphabetData);

    this.parseAlphabetData();
  }

  private parseAlphabetData(): void {
    if (!this.alphabetData || this.letters.length === 0) {
      this.alphabetPairs = [];
      return;
    }

    const pairs: AlphabetPair[] = [];

    // Convert object key-value pairs to AlphabetPair array
    for (const [letter, pronunciation] of Object.entries(this.alphabetData)) {
      if (letter && pronunciation) {
        pairs.push({
          letter: letter,
          pronunciation: pronunciation as string,
        });
      }
    }

    this.alphabetPairs = pairs;
  }
}
