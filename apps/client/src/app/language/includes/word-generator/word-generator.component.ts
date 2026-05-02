import {Component, OnInit, Input} from '@angular/core';
import {LanguageService} from '../../../services/language-service/language.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
    selector: 'app-word-generator',
    standalone: true,
    imports: [
        FormsModule,
        NgIf,
        NgForOf
    ],
    providers: [LanguageService],
    templateUrl: './word-generator.component.html',
    styleUrls: ['../../language.component.scss']
})
export class WordGeneratorComponent implements OnInit {

    @Input() language: any = {};
    wordList: any = [];
    wordSettings = {
        target: 'english',
        count: 5
    };

    response: any;
    data: any = [];

    constructor(private languageService: LanguageService) {
    }

    ngOnInit() {
      this.wordList = [];
    }

    generateWords() {
      this.languageService.generateWords(this.language.id, this.wordSettings).subscribe({
        next: (response: any) => {
          this.response = response;
          this.wordList = this.response.data.words;
        }
      });
    }

}
