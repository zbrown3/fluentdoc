import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgClass, NgForOf, NgOptimizedImage } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule,
} from '@angular/material/table';
import {
  BS_MODAL_CONFIG,
  CommonPhraseExamples,
  LANGUAGE_SUBSECTIONS,
} from '../../../common/utils/constants';
import { UtilityService } from '../../../services/util-service/utility.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { IpaInputComponent } from '../../../../components/ipa-input/ipa-input.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ImportFileComponent } from '../../../../components/import-file/import-file.component';
import {
  PDF_EXPORT_TYPES,
  PLAN_TYPES,
  TYPE_PHRASES
} from '../../../../utils/constants';
import { ExportOrShareModalComponent } from '../../../../components/export-or-share-modal/export-or-share-modal.component';
import { PlanLimits } from '../../language.component';
@Component({
  selector: 'app-phrases',
  standalone: true,
  imports: [
    ExportOrShareModalComponent,
    FormsModule,
    IpaInputComponent,
    MatCell,
    MatCellDef,
    MatCheckbox,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginatorModule,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableModule,
    NgClass,
    NgForOf,
    NgOptimizedImage,
    ProgressbarModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  providers: [
    ToastrService,
    UtilityService,
  ],
  templateUrl: '../phrases/include.phrases.html',
  styleUrls: ['../phrases/include.phrases.scss'],
})
export class PhraseComponent implements OnInit {
  @Input() language: any = {};
  @Input() commonPhrases: any = [];
  @Input() limits!: PlanLimits;
  @Input() planType!: string;
  exportPdfTypeKey = PDF_EXPORT_TYPES.PHRASE_BOOK.key;
  commonPhraseExamples = CommonPhraseExamples;

  @ViewChild(MatTable) table: MatTable<any> | undefined;
  pageEvent: PageEvent = new PageEvent();
  // paginator settings
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  displayedPhrases = [];

  // reactive form
  submitted = false;
  editMode = false;
  editIndex: number = -1;
  // build form vars
  addPhraseForm = new FormGroup({
    phrase: new FormControl('', [Validators.required]),
    pronunciation: new FormControl('', [Validators.required]),
    meaning: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  importWordsEnabled = true;
  searchQuery: string = '';

  // convenience getter for easy access to form fields
  get f() {
    return this.addPhraseForm.controls;
  }

  constructor(
    private utilityService: UtilityService,
    protected bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private toastr: ToastrService,
  ) {}
  // data table object
  tableColumns: string[] = [
    'select',
    'phrase',
    'pronunciation',
    'meaning',
    'action',
  ];
  selection = new SelectionModel<any>(true, []);
  dataSource: any = [];

  @Output() submitEvent = new EventEmitter<any>();

  update() {
    this.submitEvent.emit(this.dataSource);
  }

  ngOnInit(): void {
    // if phrases object is null, initialize empty array
    if (
      !this.commonPhrases ||
      (Object.entries(this.commonPhrases).length === 0 &&
        this.commonPhrases.constructor === Object)
    ) {
      this.commonPhrases = [];
    } else {
      // populate data array from database
      const existingData: any = [];
      this.commonPhrases.forEach(function (entry: any) {
        existingData.push(entry);
      });
      this.dataSource = existingData;
      this.displayedPhrases = this.dataSource.slice(0, this.pageSize);
    }
  }

  isStarterPlan(){
    return this.planType === PLAN_TYPES.STARTER;
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.bsModalService.show(template, {
      ...BS_MODAL_CONFIG,
      class: 'modal-dialog-centered modal-md',
    });
  }

  // pagination
  handlePageEvent(event: any) {
    this.pageEvent = event;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.displayedPhrases = this.dataSource.slice(
      event.pageIndex * event.pageSize,
      (event.pageIndex + 1) * event.pageSize
    );
  }

  // programatically close offcanvas
  closeOffcanvas() {
    const closeCanvas = document.querySelector(
      '[data-bs-dismiss="offcanvas"]'
    ) as HTMLElement;
    if (closeCanvas) {
      closeCanvas.click();
    }
  }

  // update displayed phrase on table
  updateDisplayedPhrases() {
    this.pageEvent.length = this.dataSource.length;
    this.displayedPhrases = this.dataSource.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }

  // add new phrase
  addPhrase() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addPhraseForm.invalid) {
      return;
    }

    // if word already exists, return error IF not in edit mode
    if (
      !this.editMode &&
      !this.editIndex &&
      this.dataSource.some(
        (item: any) => item.phrase === this.addPhraseForm.controls.phrase.value
      )
    ) {
      this.toastr.error('Phrase already exists');
      return;
    }

    // check for OTHER field and build new wordObject accordingly
    const newPhraseObject = {
      phrase: this.addPhraseForm.controls.phrase.value,
      pronunciation: this.addPhraseForm.controls.pronunciation.value,
      meaning: this.addPhraseForm.controls.meaning.value,
      notes: this.addPhraseForm.controls.notes.value,
    };

    // if edit mode, update existing phrase
    if (this.editMode) {
      // get index of old value and set new data to
      this.dataSource[this.editIndex] = newPhraseObject;
      this.commonPhrases[this.editIndex] = newPhraseObject;

      // update table
      this.dataSource = this.dataSource.slice();
    } else {
      // update table
      this.dataSource.push(newPhraseObject);
    }

    this.table?.renderRows();
    // reset form
    this.resetForm();
    this.update();

    // update display phrase
    this.updateDisplayedPhrases();

    // close canvas for phrasePanel
    const phrasePanelCanvas = document.getElementById('phrasePanel');
    // remove class to hide canvas
    phrasePanelCanvas?.classList.remove('show');
  }

  // Delete vocab word
  deletePhrase(event: any) {
    // filter element from table out of data if word exists
    this.dataSource = this.dataSource.filter(function (value: any) {
      return value.phrase !== event.phrase;
    });

    // Remove from selection if selected
    this.selection.deselect(event);

    // update table
    this.table?.renderRows();

    this.update();

    // update display phrase
    this.updateDisplayedPhrases();
  }

  resetForm() {
    // reset form
    this.submitted = false;
    this.editMode = false;
    this.editIndex = -1;
    this.addPhraseForm.reset();
    this.closeOffcanvas();
  }

  populatePhraseForm(event: any, index: number) {
    this.editMode = true;
    this.editIndex = index;
    // set form data to selected phrase
    this.addPhraseForm.setValue({
      phrase: event.phrase,
      pronunciation: event.pronunciation,
      meaning: event.meaning,
      notes: event.notes,
    });
  }

  // Whether the number of selected elements matches the total number of rows.
  isAllSelected() {
    const numSelected = this.selection.selected?.length;
    const numRows = this.dataSource?.length;
    return numSelected === numRows;
  }

  deleteSelectedPhrases() {
    // Close modal first
    this.bsModalRef.hide();

    // Store selected items before setTimeout to avoid race conditions
    const selectedItems = [...this.selection.selected];

    // Delay the update to allow the modal to close first
    setTimeout(() => {
      this.dataSource = this.dataSource.filter(
        (item: any) =>
          !selectedItems.some(
            (selected) =>
              selected.phrase === item.phrase &&
              selected.pronunciation === item.pronunciation &&
              selected.meaning === item.meaning
          )
      );

      // Update table display
      this.table?.renderRows();
      this.update();
      this.updateDisplayedPhrases();

      // Clear selections after update
      this.selection.clear();
    }, 150); // Small delay (in ms) to ensure UI updates
  }

  clearSearchFilter() {
    this.searchQuery = '';
    this.dataSource = this.commonPhrases;

    // update smart table
    this.table?.renderRows();
    // update display words
    this.updateDisplayedPhrases();
  }

  filterDataOnQuery() {
    const query = this.searchQuery.toLowerCase(); // Convert search query to lowercase

    this.dataSource = this.commonPhrases.filter(
      (item: any) =>
        // return if anything but notes includes search query
        item.phrase.toLowerCase().includes(query) ||
        item.pronunciation.toLowerCase().includes(query) ||
        item.meaning.toLowerCase().includes(query)
    );

    // update smart table
    this.table?.renderRows();
    // update display words
    this.updateDisplayedPhrases();
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  openImportFileModal() {
    const initialState = {
      type: TYPE_PHRASES,
      limit: this.limits.phrases,
      count: this.dataSource.length,
      planType: this.planType
    };
    this.bsModalRef = this.bsModalService.show(ImportFileComponent, {
      ...BS_MODAL_CONFIG,
      initialState,
      class: 'modal-dialog-centered modal-sm',
    });

    this.bsModalRef.content.update.subscribe((result: any) => {
      this.commonPhrases = result;
      this.dataSource = result;
      // update smart table
      this.table?.renderRows();
      this.updateDisplayedPhrases();
    });
  }

  reachedPhrasesLimit() {
    return this.limits.phrases > 0 && this.dataSource.length >= this.limits.phrases;
  }

  /***********************
   ***********************
   *        FORMAT       *
   ***********************
   **********************/
  formatDynamicString(description: string, repr: string) {
    return this.utilityService.formatDynamicString(description, repr);
  }

  filterPronunciation(word: any) {
    return this.utilityService.wrapWithSlashes(word);
  }

  protected readonly LANGUAGE_SUBSECTIONS = LANGUAGE_SUBSECTIONS;
}
