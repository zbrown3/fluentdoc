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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgClass, NgForOf, NgOptimizedImage } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatTable, MatTableModule } from '@angular/material/table';
import { UtilityService } from '../../../services/util-service/utility.service';
import {
  BS_MODAL_CONFIG,
  LANGUAGE_SUBSECTIONS,
  PartsOfSpeech,
  SWADESH_LIST,
} from '../../../common/utils/constants';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { MatSortModule } from '@angular/material/sort';
import { IpaInputComponent } from '../../../../components/ipa-input/ipa-input.component';
import { ImportFileComponent } from '../../../../components/import-file/import-file.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import {
  PDF_EXPORT_TYPES, PLAN_TYPES,
  TYPE_DICTIONARY,
} from '../../../../utils/constants';
import { ExportOrShareModalComponent } from '../../../../components/export-or-share-modal/export-or-share-modal.component';
import { PlanLimits } from '../../language.component';
@Component({
  selector: 'app-vocab',
  standalone: true,
  imports: [
    ExportOrShareModalComponent,
    FormsModule,
    IpaInputComponent,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgClass,
    NgForOf,
    NgOptimizedImage,
    ProgressbarModule,
    ReactiveFormsModule,
    TooltipModule,
    TypeaheadModule,
  ],
  providers: [
    ToastrService,
    UtilityService,
  ],
  templateUrl: '../vocab/include.vocab.html',
  styleUrls: ['../vocab/include.vocab.scss'],
})
export class VocabComponent implements OnInit {
  @Input() language: any = {};
  @Input() vocab: any = [];
  @Input() limits!: PlanLimits;
  @Input() planType!: string;
  vocabList = new VocabList();
  exportDictionaryPdfType = PDF_EXPORT_TYPES.DICTIONARY.key;

  @ViewChild(MatTable) table: MatTable<any> | undefined;
  pageEvent: PageEvent = new PageEvent();
  // paginator settings
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  displayedWords = [];

  // reactive form
  submitted = false;
  editMode = false;
  editIndex: number = -1;
  addWordForm = new FormGroup({
    pos: new FormControl('', [Validators.required]),
    word: new FormControl('', Validators.required),
    pronunciation: new FormControl('', [Validators.required]),
    meaning: new FormControl('', [Validators.required]),
    notes: new FormControl(null),
  });

  importWordsEnabled = true;
  searchQuery: string = '';

  // convenience getter for easy access to form fields
  get f() {
    return this.addWordForm.controls;
  }

  constructor(
    private toastr: ToastrService,
    public bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private utilityService: UtilityService,
  ) {}

  // table settings
  tableColumns: string[] = [
    'select',
    'word',
    'pronunciation',
    'meaning',
    'pos',
    'action',
  ];
  selection = new SelectionModel<any>(true, []);
  dataSource: any = [];

  settings = {
    columns: {
      select: {
        title: '',
      },
      word: {
        title: 'Word',
      },
      meaning: {
        title: 'Meaning',
      },
      pronunciation: {
        title: 'Phonetic Transcription',
      },
      pos: {
        title: 'Part of Speech',
        editor: {
          // Make Editor for POS a dropdown list
          type: 'list',
          config: {
            list: [
              { value: 'Noun', title: 'Noun' },
              { value: 'Verb', title: 'Verb' },
              { value: 'Pronoun', title: 'Pronoun' },
              { value: 'Determiner', title: 'Determiner' },
              { value: 'Adjective', title: 'Adjective' },
              { value: 'Conjunction', title: 'Conjunction' },
              { value: 'Preposition', title: 'Preposition' },
            ],
          },
        },
      },
    },

    // custom css styling (from bootstrap)
    attr: {
      class:
        'table table-striped table-bordered table-responsive-md table-hover',
    },

    // actions
    actions: {
      add: false,
    },

    // delete button
    delete: {
      deleteButtonContent:
        '<fa-icon [icon]="[\'fas\', \'trash-alt\']" class="text-danger ms-2"></fa-icon>',
      confirmDelete: true,
    },
    // edit button
    edit: {
      editButtonContent:
        '<fa-icon [icon]="[\'fas\', \'pencil\']" class="text-primary mr-2"></fa-icon>',
      saveButtonContent: '<div>Update</div>',
      cancelButtonContent: '<div>Cancel</div>',
      confirmSave: true,
    },
  };

  mobileSettings = {
    columns: {
      word: {
        title: 'Word',
      },
      meaning: {
        title: 'Meaning',
      },
      pos: {
        title: 'Part of Speech',
        editor: {
          type: 'list',
          config: {
            // Make Editor for POS a dropdown list
            list: [
              { value: 'Noun', title: 'Noun' },
              { value: 'Verb', title: 'Verb' },
              { value: 'Pronoun', title: 'Pronoun' },
              { value: 'Determiner', title: 'Determiner' },
              { value: 'Adjective', title: 'Adjective' },
              { value: 'Conjunction', title: 'Conjunction' },
              { value: 'Preposition', title: 'Preposition' },
            ],
          },
        },
      },
      notes: {
        title: 'Notes',
      },
    },
    // custom css styling (from bootstrap)
    attr: {
      class:
        'table table-striped table-bordered table-responsive-md table-hover',
    },
    actions: false,
  };

  @Output() submitEvent = new EventEmitter<string>();

  update() {
    this.submitEvent.emit(this.dataSource);
  }

  ngOnInit(): void {
    // build form

    // if vocab is null, initialize empty array
    if (!this.vocab) {
      this.vocab = [];
    } else {
      // populate data array from database
      const existingData: any = [];
      this.vocab.forEach(function (entry: any) {
        existingData.push(entry);
      });
      this.populatePartOfSpeechObject();
      this.dataSource = existingData;
      this.displayedWords = this.dataSource.slice(0, this.pageSize);
    }
  }

  isStarterPlan(){
    return this.planType === PLAN_TYPES.STARTER;
  }

  // sort displayed words
  sortData(event: any) {
    const data = this.dataSource.slice();

    if (!event.active || event.direction === '') {
      this.displayedWords = data;
    } else {
      this.displayedWords = data.sort((a: any, b: any) => {
        const aValue = (a as any)[event.active];
        const bValue = (b as any)[event.active];
        return (
          (aValue < bValue ? -1 : 1) * (event.direction === 'asc' ? 1 : -1)
        );
      });
    }
  }

  // Whether the number of selected elements matches the total number of rows.
  isAllSelected() {
    const numSelected = this.selection.selected?.length;
    const numRows = this.dataSource?.length;
    return numSelected === numRows;
  }

  deleteSelectedWords() {
    // Close modal first
    this.bsModalRef.hide();

    // Delay the update to allow the modal to close first
    setTimeout(() => {
      this.dataSource = this.dataSource.filter(
        (item: any) =>
          !this.selection.selected.some(
            (selected) =>
              selected.word === item.word && selected.pos === item.pos
          )
      );

      // Update table display
      this.table?.renderRows();
      this.update();
      this.updateDisplayedWords();

      // Clear selections after update
      this.selection.clear();
    }, 150); // Small delay (in ms) to ensure UI updates
  }

  clearSearchFilter() {
    this.searchQuery = '';
    this.dataSource = this.vocab;

    // update smart table
    this.table?.renderRows();
    // update display words
    this.updateDisplayedWords();
  }

  filterDataOnQuery() {
    const query = this.searchQuery.toLowerCase(); // Convert search query to lowercase

    this.dataSource = this.vocab.filter(
      (item: any) =>
        // return if anything but notes includes search query
        item.word.toLowerCase().includes(query) ||
        item.pos.toLowerCase().includes(query) ||
        item.pronunciation.toLowerCase().includes(query) ||
        item.meaning.toLowerCase().includes(query)
    );

    // update smart table
    this.table?.renderRows();
    // update display words
    this.updateDisplayedWords();
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

  // pagination
  handlePageEvent(event: any) {
    this.pageEvent = event;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.displayedWords = this.dataSource.slice(
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

  // update displayed words on table
  updateDisplayedWords() {
    this.pageEvent.length = this.dataSource.length;
    this.displayedWords = this.dataSource.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }

  /***********************
   ***********************
   *        FORMAT       *
   ***********************
   **********************/
  formatDynamicString(description: string, repr: string) {
    return this.utilityService.formatDynamicString(description, repr);
  }

  resetWordForm() {
    this.submitted = false;
    this.editMode = false;
    this.editIndex = -1;
    this.addWordForm.reset();
  }

  // populate form with existing word data
  populatePanel(event: any, index: any) {
    // set to edit mode
    this.editMode = true;
    this.editIndex = index;
    // set form data to selected word
    this.addWordForm.controls.pos.setValue(event.pos);
    this.addWordForm.controls.word.setValue(event.word);
    this.addWordForm.controls.pronunciation.setValue(event.pronunciation);
    this.addWordForm.controls.meaning.setValue(event.meaning);
    this.addWordForm.controls.notes.setValue(event.notes);
  }

  // add new word
  addWord() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addWordForm.invalid) {
      return;
    }

    // check if word with that pos already exists in vocab IF not in edit mode
    if (!this.editMode && this.dataSource.length > 0) {
      const wordExists = this.dataSource.filter(
        (word: any) =>
          word.word === this.addWordForm.controls.word.value &&
          word.pos === this.addWordForm.controls.pos.value
      );
      if (wordExists.length > 0) {
        this.toastr.error('Word already exists in vocabulary');
        return;
      }
    }

    const newWordObject = {
      pos: this.addWordForm.controls.pos.value,
      word: this.addWordForm.controls.word.value,
      pronunciation: this.addWordForm.controls.pronunciation.value,
      meaning: this.addWordForm.controls.meaning.value,
      notes: this.addWordForm.controls.notes.value,
    };

    // if in edit mode, update word
    if (this.editMode) {
      // get index of old value and set new data to
      this.dataSource[this.editIndex] = newWordObject;
      this.vocab[this.editIndex] = newWordObject;

      // update table
      this.dataSource = this.dataSource.slice();
    } else {
      this.dataSource.push(newWordObject);
    }

    // update smart table
    this.table?.renderRows();
    // reset form
    this.resetForm();
    this.update();

    // update display words
    this.updateDisplayedWords();

    // close canvas for wordPanel
    const wordPanelCanvas = document.getElementById('wordPanel');
    // remove class to hide canvas
    wordPanelCanvas?.classList.remove('show');
  }

  // Delete vocab word
  deleteWord(event: any) {
    // filter element from table out of data if it has the same word and pos
    this.dataSource = this.dataSource.filter(
      (word: any) => word.word !== event.word || word.pos !== event.pos
    );

    // Remove from selection if selected
    this.selection.deselect(event);

    // update smart table
    this.table?.renderRows();

    this.update();

    // update display words
    this.updateDisplayedWords();
  }

  filterPronunciation(word: any) {
    return this.utilityService.wrapWithSlashes(word);
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.bsModalService.show(template, {
      ...BS_MODAL_CONFIG,
      class: 'modal-dialog-centered modal-md',
    });
  }

  resetForm() {
    // reset form
    this.submitted = false;
    this.addWordForm.reset();
    this.closeOffcanvas();
  }

  reachedVocabLimit() {
    return this.limits && this.limits.words > 0 && this.dataSource.length >= this.limits.words;
  }

  // Populate POS tags from user language object
  populatePartOfSpeechObject() {
    // bring VocabList class into scope for nested function
    const vocabList = this.vocabList;

    const posValues = [
      { value: 'Noun', title: 'Noun' },
      { value: 'Verb', title: 'Verb' },
      { value: 'Pronoun', title: 'Pronoun' },
      { value: 'Determiner', title: 'Determiner' },
      { value: 'Adjective', title: 'Adjective' },
      { value: 'Conjunction', title: 'Conjunction' },
      { value: 'Preposition', title: 'Preposition' },
    ];

    // Set POS values to ARRAY
    const valueArray: any = [];
    Object.values(posValues).forEach(function (item) {
      valueArray.push(item.value);
    });

    // iterate through all POS tags in vocab
    // and add custom tags to arrayList
    // Also - add to VocabList array to
    // populate initial selector array
    this.vocab.forEach(function (entry: any) {
      if (!valueArray.includes(entry.pos)) {
        const newPosTag = { value: entry.pos, title: entry.pos };
        posValues.push(newPosTag);

        // add to selector POS tags
        vocabList.addPartOfSpeech(entry.pos);
      }
    });

    // Populate table data drop down with all POS tags for user
    this.settings.columns.pos.editor.config.list = posValues;
    this.mobileSettings.columns.pos.editor.config.list = posValues;
  }

  // add new POS tag to user session data in real-time
  addNewPosTag(newTag: any) {
    this.vocabList.addPartOfSpeech(newTag);
    const newPosTag = { value: newTag, title: newTag };
    this.settings.columns.pos.editor.config.list.push(newPosTag);
    // this.mobileSettings.columns.pos.editor.config.list.push(newPosTag);
  }

  openImportFileModal() {
    const initialState = {
      type: TYPE_DICTIONARY,
      limit: this.limits.words,
      count: this.dataSource.length,
      planType: this.planType
    };
    this.bsModalRef = this.bsModalService.show(ImportFileComponent, {
      ...BS_MODAL_CONFIG,
      initialState,
      class: 'modal-dialog-centered modal-sm',
    });

    this.bsModalRef.content.update.subscribe((result: any) => {
      this.vocab = result;
      this.dataSource = result;
      // update smart table
      this.table?.renderRows();
      this.updateDisplayedWords();
    });
  }

  protected readonly LANGUAGE_SUBSECTIONS = LANGUAGE_SUBSECTIONS;
}

class VocabList {
  // part of speech list
  partsOfSpeech: any = [];

  words: any = [];

  constructor() {
    // initialize parts of speech
    this.partsOfSpeech = PartsOfSpeech;

    // initialize words
    this.words = SWADESH_LIST;
  }

  addPartOfSpeech(partOfSpeech: any) {
    // add new POS to dropdown menu
    this.partsOfSpeech.splice(this.partsOfSpeech.length - 1, 0, partOfSpeech);
  }

  getPartOfSpeechDescription(posName: any) {
    return (
      this.partsOfSpeech.find((pos: any) => pos?.name === posName)
        ?.description || ''
    );
  }
}
