import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {FileUploader, FileUploadModule} from 'ng2-file-upload';
import {environment} from '../../environments/environment';
import {DecimalPipe, NgClass, NgForOf} from '@angular/common';
import {DictionaryCanvasComponent} from './includes/dictionary-canvas/dictionary-canvas.component';
import {PhrasesCanvasComponent} from './includes/phrases-canvas/phrases-canvas.component';
import {PLAN_TYPES, TYPE_DICTIONARY} from '../../utils/constants';

@Component({
  selector: 'app-import-file',
  standalone: true,
  imports: [
    FormsModule,
    TooltipModule,
    FileUploadModule,
    NgClass,
    DecimalPipe,
    NgForOf,
    DictionaryCanvasComponent,
    PhrasesCanvasComponent
  ],
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss']
})
export class ImportFileComponent implements OnInit {

  @Input() type: string | undefined;
  @Input() limit!: number;
  @Input() count!: number;
  @Input() planType!: string;

  status_default: string = 'PENDING';
  status_uploading: string = 'UPLOADING';
  status_error: string = 'ERROR';
  status_success: string = 'SUCCESS';
  error_message: string = '';

  @Output() update = new EventEmitter<string>();

  public hasBaseDropZoneOver: boolean = false;

  // file uploader config
  fileUploader = new FileUploader({
    url: '',
    allowedMimeType: [
      'text/csv',            // CSV files
      'application/json',     // JSON files
      'text/tab-separated-values', // TSV files
      'text/plain'           // Plain text (TSV sometimes comes as text/plain)
    ],
    maxFileSize: 50 * 1024 * 1024, // Increased to 50MB
  });
  entryCount: number = 0;
  updateStatus: string = this.status_default;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
    // set withCredentials to true for CORS
    this.fileUploader.onBeforeUploadItem = (item) => {
      item.withCredentials = true;
    }
    // url where the file will be uploaded
    this.fileUploader.setOptions({
      url: `${environment.baseUrl}/import/${this.type}?languageId=${localStorage.getItem('languageId')}`,
      disableMultipart: false,
      autoUpload: false
    });

    this.fileUploader.onBeforeUploadItem = () => {
      this.updateStatus = this.status_uploading;
    };

    this.fileUploader.onCompleteItem = (item: any, response: any, status: any) => {
      if (status === 200) {
        // Parse the response as JSON
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(response);
        } catch (error) {
          return; // Exit if parsing fails
        }

        // Assign values properly
        this.entryCount = parsedResponse?.data?.entries;
        const importedData = this.type === TYPE_DICTIONARY ? parsedResponse?.data?.language?.vocab : parsedResponse?.data?.language?.phrases;
        this.update.emit(importedData);
        this.updateStatus = this.status_success;
      } else {
        // Parse the response as JSON
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(response);
        } catch (error) {
          return; // Exit if parsing fails
        }
        this.error_message = parsedResponse?.error?.message;
        this.updateStatus = this.status_error;
      }

      this.fileUploader.clearQueue(); // Clear the uploader queue
    };

    // Handle errors, including HTTP 500
    this.fileUploader.onErrorItem = () => {
      this.updateStatus = this.status_error;

      this.fileUploader.clearQueue(); // Clear queue to allow re-upload
    };
  }

  isStarterPlan() {
    return this.planType === PLAN_TYPES.STARTER;
  }

  closeModal() {
    this.bsModalRef.hide();
    this.fileUploader.clearQueue();
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  getRemainingLimit() {
    return this.limit - this.count;
  }

  protected readonly TYPE_DICTIONARY = TYPE_DICTIONARY;

}
