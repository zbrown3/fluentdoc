import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartsOfSpeech } from '../common/utils/constants';
import { HttpClient } from '@angular/common/http';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-glossary',
  standalone: true,
  templateUrl: './glossary.component.html',
  imports: [
    NgForOf,
    FormsModule,
    NgClass,
    LoadingSpinnerComponent
  ],
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit {
  loading = true;
  searchText: string = '';
  selectedAlpha: string = '';
  filteredWords: any = [];
  glossaryWords: any = [];

  constructor(private http: HttpClient, private spinner: NgxSpinnerService,) {
  }

  getGlossary() {
    // Use a relative asset path so this works in browser and desktop (file/electron) contexts.
    return this.http.get<any[]>('assets/data/glossary.json');
  }

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();
    this.getGlossary().subscribe({
      next: (glossary: any) => {
        this.glossaryWords = [
          ...PartsOfSpeech,
          ...glossary
        ];
        this.filteredWords = this.glossaryWords;
        this.loading = false;
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error loading glossary:', err);
        // Avoid leaving the page in perpetual loading state on desktop path failures.
        this.glossaryWords = [...PartsOfSpeech];
        this.filteredWords = this.glossaryWords;
        this.loading = false;
        this.spinner.hide();
      }
    });
  }

  setSelectedAlpha(alpha: any) {
    this.selectedAlpha = this.selectedAlpha === alpha ? '' : alpha;
  }

 // filter words based on search text and selected first letter
  getFilteredWords() {
    return this.getSortedGlossary().filter((item: { name: string; }) => {
      return item.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
        (this.selectedAlpha === '' || item.name[0].toUpperCase() === this.selectedAlpha);
    });
  }

  extractFirstLetters() {
    const firstLetters = new Set();
    this.getSortedGlossary() && this.getSortedGlossary().forEach((item: { name: string | any[]; }) => {
      if (item.name && item.name.length > 0) {
        firstLetters.add(item.name[0].toUpperCase()); // Adding the first letter, capitalized
      }
    });
    return Array.from(firstLetters); // Converting the Set to an Array for easy usage
  }

  extractFirstLettersOfFilteredWords() {
    const firstLetters = new Set();
    this.getFilteredWords().forEach((item: { name: string | any[]; }) => {
      if (item.name && item.name.length > 0) {
        firstLetters.add(item.name[0].toUpperCase()); // Adding the first letter, capitalized
      }
    });
    return Array.from(firstLetters); // Converting the Set to an Array for easy usage
  }

  getWordsWithFirstLetter(letter: any) {
    return this.getFilteredWords().filter((item: { name: string; }) => item.name[0].toUpperCase() === letter);
  }

  clearSearch() {
    this.searchText = '';
  }

  getSortedGlossary() {
    return this.glossaryWords.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name));
  }
}

