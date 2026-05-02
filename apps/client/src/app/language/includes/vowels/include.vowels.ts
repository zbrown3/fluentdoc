import {Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {FormsModule} from '@angular/forms';
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {LANGUAGE_SUBSECTIONS, QUILL_CONFIG} from "../../../common/utils/constants";
import {UtilityService} from "../../../services/util-service/utility.service";
import {IpaQuillEditorComponent} from "../../../../components/ipa-quill-editor/ipa-quill-editor.component";
import {VowelChartComponent, VowelKey} from "./vowel-chart/vowel-chart.component";

@Component({
  selector: 'app-vowels',
  standalone: true,
  imports: [
    FormsModule,
    TooltipModule,
    IpaQuillEditorComponent,
    VowelChartComponent
  ],
  providers: [ToastrService, UtilityService],
  templateUrl: './include.vowels.html',
  styleUrls: ['../../language.component.scss']
})

export class VowelComponent implements OnInit {

  @Input() language: any = {};
  @Input() vowels: any = {};
  @Input() isSaving: boolean = false;
  @Output() submitEvent = new EventEmitter<string>();
  currentAudioStream: any;
  returnObject: any = {};
  showDescription = true;

  // keep your existing fields…
  selectedVowels = new Set<VowelKey>();

  constructor(private toastr: ToastrService,
              private utilityService: UtilityService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // build selection from your existing booleans
    this.syncSelectedFromObject();
  }


  private syncSelectedFromObject() {
    const s = new Set<VowelKey>();
    for (const [k, v] of Object.entries(this.vowels || {})) {
      if (v) s.add(k as VowelKey);
    }
    this.selectedVowels = s;
  }

  onSelectedChange(next: Set<VowelKey>) {
    // reflect back into your booleans (keeps your backend unchanged)
    const keys = new Set(next);
    const updated: Record<string, boolean> = {};
    // preserve existing keys, set true/false
    for (const k of Object.keys(this.vowels || {})) updated[k] = keys.has(k as VowelKey);
    // also include any new keys from the chart that weren’t in the object yet
    next.forEach(k => updated[k] = true);
    this.vowels = updated;
    this.selectedVowels = next;
  }

  onListen(k: VowelKey) {
    this.playVowelSound(k);
  }

  // call this after save if the object changes externally
  refreshChartFromModel() {
    this.syncSelectedFromObject();
  }

  update() {
    this.returnObject = {
      'description': this.language.vowelsDescription,
      'vowels': this.vowels
    };
    this.submitEvent.emit(this.returnObject);
    this.refreshChartFromModel();
  }

  playVowelSound(phoneme: any) {
    // set audio stream to current phoneme
    this.currentAudioStream = phoneme;

    this.play('vowels', phoneme).then(() => {
      // when audio file is finished, empty stream
      this.currentAudioStream = null;
      this.cdr.detectChanges();
    })
      .catch(
        () => {
          this.toastr.error('There was an error playing the audio. Please try again later.');
          this.currentAudioStream = null;
          this.cdr.detectChanges();
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
  play(type: string, phoneme: string) {
    return new Promise(function (resolve, reject) {
      const audio = new Audio();
      audio.src = 'assets/sounds/' + type + '/' + phoneme + '.m4a';
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

  protected readonly QUILL_CONFIG = QUILL_CONFIG;
  protected readonly LANGUAGE_SUBSECTIONS = LANGUAGE_SUBSECTIONS;
}



