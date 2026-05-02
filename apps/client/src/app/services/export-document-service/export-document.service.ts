import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PdfExportRequest } from '../../../components/export-or-share-modal/export-or-share-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ExportDocumentService {
  // baseUrl
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // function to call the export document api
  exportDocuments(
    languageId: string,
    exportOptions: PdfExportRequest
  ): Observable<Blob> {
    return this.http.post<Blob>(
      this.baseUrl + '/export/' + languageId,
      exportOptions,
      {
        withCredentials: true,
        responseType: 'blob' as 'json',
      }
    );
  }
}
