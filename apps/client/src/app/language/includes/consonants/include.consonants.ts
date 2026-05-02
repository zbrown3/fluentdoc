import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {FormsModule} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {LANGUAGE_SUBSECTIONS, QUILL_CONFIG} from "../../../common/utils/constants";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {UtilityService} from "../../../services/util-service/utility.service";
import {IpaQuillEditorComponent} from "../../../../components/ipa-quill-editor/ipa-quill-editor.component";


@Component({
  selector: 'app-consonants',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    TooltipModule,
    NgClass,
    IpaQuillEditorComponent
  ],
    providers: [ToastrService, UtilityService],
  templateUrl: './include.consonants.html',
  styleUrls: ['./include.consonants.scss']
})

export class ConsonantComponent {

  @Input() language: any = {};
  @Input() consonants: any = {};
  @Input() isSaving: boolean = false;
  @Output() submitEvent = new EventEmitter<string>();
  currentAudioStream: any;
  returnObject: any = {};
  showDescription = true;

  // tab fields
  activeTab: string = 'pulmonic';

  /***********************
   ***********************
   ***   QUIL CONFIG  ***
   ***********************
   **********************/
   quillConfig = QUILL_CONFIG;

  constructor(private toastr: ToastrService,
              private utilityService: UtilityService) {}

  // function to change tab
  changeTab(section: string) {
    this.activeTab = section;
  }

  update() {
    this.returnObject = {
      'description': this.language.consonantsDescription,
      'consonants': this.consonants
    };
    this.submitEvent.emit(this.returnObject);
  }

  playConsonantSound(phoneme: any) {
    // set audio stream to current phoneme
    this.currentAudioStream = phoneme;

    this.play('consonants', phoneme).then( () => {
      // when audio file is finished, empty stream
      this.currentAudioStream = null;
    })
        .catch(
            () => {
              this.toastr.error('There was an error playing the audio. Please try again later.');
              this.currentAudioStream = null;
            }
        );
  }

  /**
   * Create Promise for audio file so we can tell when the audio is finished playing
   * note: for visual aid for better user experience a spinner or some kind of identifier
   * can be added to the sound file to ensure that it is playing.
   * @param type
   * @param phoneme
   */
  play(type: any, phoneme: any) {
    return new Promise(function(resolve, reject) {
      const audio = new Audio();
      audio.src = 'assets/sounds/' + type + '/' + phoneme + '.wav';
      audio.load();
      audio.play();
      audio.onerror = reject;
      audio.onended = resolve;
    });
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

