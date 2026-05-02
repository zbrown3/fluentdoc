import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DecimalPipe, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  LANGUAGE_SUBSECTIONS,
  SUCCESS_STATUS,
} from '../../../common/utils/constants';
import { UtilityService } from '../../../services/util-service/utility.service';
import { LanguageService } from '../../../services/language-service/language.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { environment } from '../../../../environments/environment';
import { FILE_TYPE_PNG } from '../../../../utils/constants';
@Component({
  selector: 'app-language-flag',
  standalone: true,
  imports: [
    FileUploadModule,
    DecimalPipe,
    FormsModule,
    NgForOf,
    LoadingSpinnerComponent,
  ],
  providers: [LanguageService, UtilityService],
  templateUrl: './language-flag.component.html',
  styleUrls: ['./language-flag.component.scss'],
})
export class LanguageFlagComponent implements OnInit, OnChanges {
  loading = true;
  editLanguage: any = {};

  @Input() language: any = {};
  @Output() submitEvent = new EventEmitter<object>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  // upload conlang flag vars
  flagUploader = new FileUploader({
    url: '',
    allowedMimeType: ['image/png', 'image/jpeg', 'image/gif'], // only allow image files
    maxFileSize: 10 * 1024 * 1024, // 10 MB
  });
  uploadingFlag: boolean = false;

  constructor(
    private languageService: LanguageService,
    private toastr: ToastrService,
    private utilService: UtilityService,
    protected bsModalRef: BsModalRef,
    protected bsModalService: BsModalService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['language']?.currentValue) {
      this.editLanguage = { ...changes['language'].currentValue };
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    /** spinner starts on init */
    this.spinner.show();
    this.editLanguage = { ...this.language };

    this.flagUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = true;
    };
    this.flagUploader.setOptions({
      url:
        environment.baseUrl +
        '/languages/' +
        localStorage.getItem('languageId') +
        '/language-flag',
    });

    this.flagUploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      // remove first element in queue if more than one item
      if (this.flagUploader.queue.length > 1) {
        this.flagUploader.queue.shift();
      }
      this.previewFlag(file.file.rawFile);
    };
    this.flagUploader.onCompleteItem = (
      item: any,
      response: any,
      status: any
    ) => {
      if (status === 200) {
        // Keep UI in sync immediately after successful upload.
        // Desktop/backend responses can differ, so extract from several common shapes.
        const parsedResponse = this.safeParseResponse(response);
        const uploadedFlagUrl = this.extractUploadedFlagUrl(parsedResponse);
        if (uploadedFlagUrl) {
          this.editLanguage.flagUrl = uploadedFlagUrl;
          this.language.flagUrl = uploadedFlagUrl;
        }

        this.submitEvent.emit({
          ...this.editLanguage,
          flagUrl: this.editLanguage.flagUrl,
        });

        this.toastr.success('Your language Flag has successfully been updated');
      } else {
        this.toastr.error(
          'There was an issue updating your language flag. Please try again later.'
        );
      }

      this.uploadingFlag = false;
      this.flagUploader.clearQueue(); // Clear the uploader queue
      this.cdr.detectChanges();
    };
    this.spinner.hide();
    this.loading = false;
  }

  update() {
    this.submitEvent.emit(this.editLanguage);
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.bsModalService.show(template);
  }

  /***********************
   ***********************
   *        FORMAT       *
   ***********************
   **********************/
  formatDynamicString(description: string, repr: string) {
    return this.utilService.formatDynamicString(description, repr);
  }

  /***********************
   ***********************
   * UPLOAD/DELETE FLAG  *
   ***********************
   **********************/
  // Clicks the hidden file input element
  triggerFileInput() {
    document.getElementById('languageFlagUpload')?.click();
  }

  downloadImageAndAddToQueue(base64string: string, filename: string) {
    const imageFile = this.utilService.convertBase64ToFile(
      base64string,
      filename,
      FILE_TYPE_PNG
    );
    if (this.flagUploader.queue.length > 1) {
      this.flagUploader.queue.shift();
    }
    this.flagUploader.addToQueue([imageFile]);
    this.previewFlag(imageFile);
  }

  deleteFlag(id: string) {
    this.languageService.deleteLanguageFlag(id).subscribe({
      next: (response: any) => {
        if (response.status === SUCCESS_STATUS) {
          this.editLanguage.flagUrl = null;
          this.language.flagUrl = null;
          this.submitEvent.emit({
            ...this.editLanguage,
            flagUrl: null,
          });
          this.bsModalRef.hide();

          // Reset the file input element
          if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.value = ''; // Reset input
          }
          this.toastr.success('Language Flag Successfully deleted!');
          this.cdr.detectChanges();
        } else {
          this.toastr.error(
            'There was an error deleting your language Flag. Please try again later.'
          );
        }
      },
    });
  }

  // Preview flag before uploading
  // This was a way to show the user their
  // current upload while giving S3 a chance to load
  // after cache is cleared
  previewFlag(files: any) {
    if (!files || (files.length !== undefined && files.length === 0)) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = () => {
      this.editLanguage.flagUrl = reader.result;
      this.language.flagUrl = reader.result;
      this.cdr.detectChanges();
    };
  }

  resetFileInput(fileInput: HTMLInputElement) {
    fileInput.value = ''; // Reset the input
    this.flagUploader.clearQueue(); // Clear the uploader queue
    this.editLanguage.flagUrl = this.language.flagUrl; // Reset the flagUrl
  }

  protected readonly SUB_SECTIONS = LANGUAGE_SUBSECTIONS;

  private safeParseResponse(response: any): any {
    if (!response) {
      return null;
    }
    if (typeof response === 'string') {
      try {
        return JSON.parse(response);
      } catch {
        return null;
      }
    }
    return response;
  }

  private extractUploadedFlagUrl(response: any): string | null {
    if (!response?.data) {
      return null;
    }
    return (
      response.data.flagUrl ||
      response.data.languageFlagUrl ||
      response.data.language?.flagUrl ||
      null
    );
  }
}
