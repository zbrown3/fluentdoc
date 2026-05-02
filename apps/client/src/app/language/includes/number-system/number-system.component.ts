import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {QuillEditorComponent} from 'ngx-quill';
import {NgClass, NgIf} from '@angular/common';
import {LANGUAGE_SUBSECTIONS, QUILL_CONFIG} from "../../../common/utils/constants";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {FaIconComponent, FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {UtilityService} from "../../../services/util-service/utility.service";

@Component({
    selector: 'app-number-system',
    standalone: true,
  imports: [
    FormsModule,
    QuillEditorComponent,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    TooltipModule,
    FaIconComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef
  ],
    providers: [ToastrService, UtilityService],
    templateUrl: './number-system.component.html',
    styleUrls: ['./number-system.component.scss']
})
export class NumberSystemComponent implements OnInit {

    @Input() language: any = {};
    editLanguage: any = {};
    @Input() numerals: any = [];
    @Output() submitEvent = new EventEmitter<object>();
    showBaseNumber = false;
    showDescription = false;

    // error display for description
    descriptionError = false;
    descriptionErrorMessage: string = '';

    // data source

    // reactive form
    submitted = false;
  // build form
    addNumeralForm = new FormGroup({
    numeral: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    pronunciation: new FormControl('', [Validators.required]),
    spelling: new FormControl('')
  });

    // convenience getter for easy access to form fields
    get f() {
        return this.addNumeralForm.controls;
    }

  @ViewChild(MatTable) table: MatTable<any> | undefined;

  // data table object
  tableColumns: string[] = ['numeral', 'pronunciation', 'spelling', 'actions']
  dataSource: any = [];


    constructor(private toastr: ToastrService,
                private utilityService: UtilityService,
                library: FaIconLibrary) {
      library.addIcons(
        faInfoCircle
      );
    }

    ngOnInit() {
        // set copy of original language for modification data
        this.editLanguage = {...this.language};

        // if vocab is null, initialize empty array
        if (!this.numerals) {
            this.numerals = [];
        } else {
            // populate data array from database
            const existingData: any = [];
            this.numerals.forEach(function (entry: any) {
                existingData.push(entry);
            });
            this.dataSource = existingData;
        }

        // hide/show on load logic
      if (this.editLanguage.baseNumber) {
            this.showBaseNumber = true;
        }
        if (this.editLanguage.numeralDescription) {
            this.showDescription = true;
        }
    }

    update(handler: string) {
        // create data object to be passed to update
        // method
        const numeralData = {
            handler: '',
            description: '',
            base: null,
            numerals: ''
        };

        if (handler === 'description') {
            numeralData.handler = 'description';
            numeralData.description = this.editLanguage.numeralDescription;
            this.submitEvent.emit(numeralData);
        } else if (handler === 'base') {
            numeralData.handler = 'base';
            numeralData.base = this.editLanguage.baseNumber;
            this.submitEvent.emit(numeralData);
        } else if (handler === 'numerals') {
            numeralData.handler = 'numerals';
            numeralData.numerals = this.dataSource;
            this.submitEvent.emit(numeralData);
        } else {
            // do nothing
        }
    }


    addNumeralDescription() {
        // description can be blank so we aren't validating it
        this.update('description');
    }

    addBaseNumber() {
        if (!this.editLanguage.baseNumber) {
            this.toastr.error('You must add a base number');
            return;
        }
        this.update('base');
    }

    removeBaseNumber() {
        this.editLanguage.baseNumber = null;
        this.update('base');
    }


    // add numeral
    addNumeral() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.addNumeralForm.invalid) {
            this.toastr.error('All fields must be filled out');
            return;
        }

        // if numeral already exists, return error
        if (this.dataSource.some((item: any) => item.numeral === this.addNumeralForm.controls.numeral.value)) {
            this.toastr.error('Numeral already exists');
            return;
        }

        const newNumeralData = {
            'numeral': this.addNumeralForm.controls.numeral.value,
            'pronunciation': this.addNumeralForm.controls.pronunciation.value,
            'spelling': this.addNumeralForm.controls.spelling.value
        };

        // update smart table
        this.dataSource.push(newNumeralData);
        this.table?.renderRows();

        // reset form
        this.resetForm();

        this.update('numerals');
    }

    // Delete vocab word
    deleteNumeral(event: any) {
        // filter element from table out of data
        this.dataSource = this.dataSource.filter(function (value: any) {
            return value.numeral !== event.numeral;
        });
        this.table?.renderRows();

        this.update('numerals');
    }

    // update existing word
    updateNumeral(event: any) {
        // if new data entered by user is not a number
        // reset value to old data
        if (isNaN(event.newData.numeral)) {
            event.newData.numeral = event.data.numeral;
        }

        // get index of old value and set new data to
        // index of old value
        const indexOfOldValue = this.dataSource.indexOf(event.data);
        this.dataSource[indexOfOldValue] = event.newData;
        this.numerals[indexOfOldValue] = event.newData;

        this.update('numerals');
    }

    resetForm() {
        // reset form
        this.submitted = false;
        this.addNumeralForm.reset();
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
