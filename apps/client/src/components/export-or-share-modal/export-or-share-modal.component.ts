import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSaverService } from 'ngx-filesaver';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ToastrService } from 'ngx-toastr';
import { DropdownComponent, type Option } from '../dropdown/dropdown.component';
import { ExportDocumentService } from '../../app/services/export-document-service/export-document.service';
import { LanguageService } from '../../app/services/language-service/language.service';
import { SUCCESS_STATUS } from '../../app/common/utils/constants';
import {APP_ROUTES, PDF_EXPORT_TYPES, PRIVACY_LEVELS} from '../../utils/constants';
import { type Language } from '../../utils/types';
import { getFormattedTitle } from '../../utils/utils';
import {RouterLink} from "@angular/router";

export const EXPORT_STATE = {
  NOT_STARTED: 'NOT_STARTED',
  EXPORTING: 'EXPORTING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

export interface ExportSection {
  include: boolean;
  exportType: 'PDF' | 'CSV'; // extendable in future
}

export interface PdfExportRequest {
  includeLanguageGuide: boolean;
  includeDictionaryInGuide: boolean;
  includePhraseBookInGuide: boolean;
  standaloneDictionary: ExportSection;
  standalonePhraseBook: ExportSection;
}

@Component({
  selector: 'app-export-or-share-modal',
  standalone: true,
  imports: [
    DropdownComponent,
    FormsModule,
    NgClass,
    ProgressbarModule,
    ReactiveFormsModule,
    TooltipModule,
    RouterLink,
  ],
  providers: [ExportDocumentService, LanguageService],
  templateUrl: './export-or-share-modal.component.html',
  styleUrls: ['./export-or-share-modal.component.scss'],
})
export class ExportOrShareModalComponent implements OnInit {
  view = 'export';
  languagePrivacyLevel: Option = {
    label: getFormattedTitle(PRIVACY_LEVELS.PRIVATE),
    value: PRIVACY_LEVELS.PRIVATE,
  };

  @Input() initialView: string = 'export';
  @Input() isPublicLanguage: boolean = false;
  @Input() isSharedLanguageFeatureEnabled: boolean = false;
  @Input() language: any;
  @Input() source: string = PDF_EXPORT_TYPES.LANGUAGE_GUIDE.key;
  @Input() isStarterPlan: boolean = true;
  @Output() languageExportedEvent = new EventEmitter<string>();
  @Output() updateLanguagePrivacySettingsEvent = new EventEmitter<Language>();

  /** Export Settings
   */
  exportOptions: PdfExportRequest = {
    includeLanguageGuide: false,
    includeDictionaryInGuide: false,
    includePhraseBookInGuide: false,
    standaloneDictionary: {
      include: false,
      exportType: 'PDF',
    },
    standalonePhraseBook: {
      include: false,
      exportType: 'PDF',
    },
  };

  exportAsOptions: Option[] = [{ label: 'PDF', value: 'PDF' }];

  // Language view privacy options
  privacyLevels = Object.entries(PRIVACY_LEVELS).map(([key, value]) => ({
    label: getFormattedTitle(value),
    value: key,
  }));

  exportStatus = EXPORT_STATE.NOT_STARTED;

  constructor(
    private _FileSaverService: FileSaverService,
    private languageService: LanguageService,
    private pdfService: ExportDocumentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.languagePrivacyLevel = {
      label: getFormattedTitle(this.language.privacyLevel),
      value: this.language.privacyLevel,
    };

    this.setExportSelectionBySource(this.source);
  }

  get isExportDisabled(): boolean {
    const o = this.exportOptions;
    return !(
      o.includeLanguageGuide ||
      o.includeDictionaryInGuide ||
      o.includePhraseBookInGuide ||
      o.standaloneDictionary.include ||
      o.standalonePhraseBook.include
    );
  }

  copyShareLink(): void {
    const currentLanguageShareLink = `${window.location.origin}/view/${this.language.id}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentLanguageShareLink).then(
        () => {
          this.toastr.success('Link copied to clipboard!');
        },
        () => {
          this.toastr.error('Failed to copy link.');
        }
      );
    }
  }

  switchView(view: string) {
    this.view = view;
  }

  autoSelectIncludeSections() {
    this.exportOptions = {
      ...this.exportOptions,
      includeDictionaryInGuide: this.exportOptions.includeLanguageGuide,
      includePhraseBookInGuide: this.exportOptions.includeLanguageGuide,
    };
  }

  setExportSelectionBySource(sourceKey: string) {
    switch (sourceKey) {
      case PDF_EXPORT_TYPES.DICTIONARY.key:
        this.exportOptions = {
          ...this.exportOptions,
          standaloneDictionary: {
            include: true,
            exportType: 'PDF',
          },
        };
        break;
      case PDF_EXPORT_TYPES.PHRASE_BOOK.key:
        this.exportOptions = {
          ...this.exportOptions,
          standalonePhraseBook: {
            include: true,
            exportType: 'PDF',
          },
        };
        break;
      case PDF_EXPORT_TYPES.LANGUAGE_GUIDE.key:
        this.exportOptions.includeLanguageGuide = true;
        this.autoSelectIncludeSections();
        break;
      default:
        return;
    }
  }

  setExportType(
    key: 'standaloneDictionary' | 'standalonePhraseBook',
    optionSelected: Option
  ) {
    this.exportOptions[key].exportType = optionSelected.value;
  }

  setPrivacyLevel(optionSelected: Option) {
    this.languagePrivacyLevel = optionSelected;
    this.saveSharePrivacySettings();
  }

  exportPDF() {
    this.exportStatus = EXPORT_STATE.EXPORTING;

    this.pdfService
      .exportDocuments(this.language.id, this.exportOptions)
      .subscribe({
        next: (response: Blob) => {
          const fileName = this.getExportFileName();
          this._FileSaverService.save(response, fileName);
          this.exportStatus = EXPORT_STATE.SUCCESS;
          this.toastr.success('Export complete! Your file was downloaded.');
          this.languageExportedEvent.emit();
        },
        error: () => {
          this.exportStatus = EXPORT_STATE.ERROR;
          this.toastr.error(
            'Something went wrong while exporting. Please try again.'
          );
        },
      });
  }

  resetExportOptions() {
    this.exportStatus = EXPORT_STATE.NOT_STARTED;
    this.exportOptions = {
      includeLanguageGuide: false,
      includeDictionaryInGuide: false,
      includePhraseBookInGuide: false,
      standaloneDictionary: {
        include: false,
        exportType: 'PDF',
      },
      standalonePhraseBook: {
        include: false,
        exportType: 'PDF',
      },
    };
  }

  // function to get the file name for the export
  private getExportFileName(): string {
    let fileName = this.language.name;
    let extension = '.pdf';

    const exportCount =
      (this.exportOptions.includeLanguageGuide ? 1 : 0) +
      (this.exportOptions.standaloneDictionary.include ? 1 : 0) +
      (this.exportOptions.standalonePhraseBook.include ? 1 : 0);

    if (exportCount > 1) {
      fileName += '_export';
      extension = '.zip';
    } else if (this.exportOptions.standaloneDictionary.include) {
      fileName += '_dictionary';
    } else if (this.exportOptions.standalonePhraseBook.include) {
      fileName += '_phrase_book';
    } else {
      fileName += '_guide';
    }

    return `${fileName}${extension}`;
  }

  saveSharePrivacySettings(): void {
    const updatedPrivacyLevel = this.languagePrivacyLevel.value;
    const settingsRequest = {
      privacyLevel: updatedPrivacyLevel,
    };

    // If privacy level has changed, then update it
    if (this.language.privacyLevel !== updatedPrivacyLevel) {
      this.languageService
        .updateLanguageSettings(this.language.id, settingsRequest)
        .subscribe({
          next: (response: any) => {
            if (response.status === SUCCESS_STATUS) {
              this.updateLanguagePrivacySettingsEvent.emit(response.data);

              this.toastr.success('Language settings successfully updated');
            } else {
              this.toastr.error(
                'There was an issue updating your language settings. Please try again later.'
              );
            }
          },
        });
    }
  }

  protected readonly EXPORT_STATE = EXPORT_STATE;
  protected readonly PRIVACY_LEVELS = PRIVACY_LEVELS;
  protected readonly APP_ROUTES = APP_ROUTES;
}
