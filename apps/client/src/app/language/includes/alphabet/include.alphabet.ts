import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LANGUAGE_SUBSECTIONS} from "../../../common/utils/constants";
import {UtilityService} from "../../../services/util-service/utility.service";

@Component({
  selector: 'app-alphabet',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgForOf,
  ],
  providers: [UtilityService],
  templateUrl: '../alphabet/include.alphabet.html',
  styleUrls: ['../../language.component.scss']
})

export class AlphabetComponent {

  @Input() consonants: any = {};
  @Input() vowels: any = {};
  @Input() alphabet: any = {};
  @Input() language: any = {};
  @Input() name: any = {};
  @Input() isSaving: boolean = false;

  @Output() submitEvent = new EventEmitter<string>();

  constructor(private utilityService: UtilityService) {
  }

  update() {
    this.submitEvent.emit(this.alphabet);
  }

  /***********************
   ***********************
   *        FORMAT       *
   ***********************
   **********************/
  formatDynamicString(description: string, repr: string) {
    return this.utilityService.formatDynamicString(description, repr);
  }

    protected readonly LANGUAGE_SUBSECTIONS = LANGUAGE_SUBSECTIONS;
}

