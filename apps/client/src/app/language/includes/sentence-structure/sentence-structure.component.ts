import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgClass, NgForOf} from '@angular/common';
import {LANGUAGE_SUBSECTIONS, QUILL_CONFIG} from "../../../common/utils/constants";
import {UtilityService} from "../../../services/util-service/utility.service";
import {IpaQuillEditorComponent} from "../../../../components/ipa-quill-editor/ipa-quill-editor.component";

@Component({
  selector: 'app-sentence-structure',
  standalone: true,
    imports: [
        FormsModule,
        NgClass,
        ReactiveFormsModule,
        NgForOf,
        IpaQuillEditorComponent
    ],
  providers: [ToastrService, UtilityService],
  templateUrl: './sentence-structure.component.html',
  styleUrls: ['../../language.component.scss']
})
export class SentenceStructureComponent implements OnInit {

  @Input() language: any = {};
  @Input() isSaving: boolean = false;
  @Output() submitEvent = new EventEmitter<object>();

  response: any;

  wordOrderList: any = [];
  editLanguage: any = {};

  // reactive form
  submitted = false;

  // build form
  wordOrderForm = new FormGroup({
    wordOrder: new FormControl('', [Validators.required]),
  });

  // convenience getter for easy access to form fields
  get f() {
    return this.wordOrderForm.controls;
  }

  constructor(private utilityService: UtilityService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    // set copy of original language for modification data
    this.editLanguage = {...this.language};

    this.wordOrderList = ['Select option', 'SOV', 'SVO', 'VSO', 'VOS', 'OSV', 'OVS', 'Free word order']

    this.wordOrderForm.controls['wordOrder'].setValue(this.editLanguage.wordOrder, {onlySelf: true});

  }

  update() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.wordOrderForm.invalid) {
      this.toastr.error('All fields must be filled out');
      return;
    }


    // create data object to be passed to update
    // method
    const sentenceStructureData = {
      wordOrder: this.wordOrderForm.controls.wordOrder.value,
      syntax: this.editLanguage.syntax,
    };

    this.submitEvent.emit(sentenceStructureData);
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
