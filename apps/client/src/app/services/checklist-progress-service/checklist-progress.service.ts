import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CHECKLIST_TYPES } from '../../../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class ChecklistProgressService {

  // baseUrl
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  // function to get the checklist progress
  getChecklistProgress(userId: string, type: string = CHECKLIST_TYPES.GETTING_STARTED): Observable<any> {
    const params = { type };

    return this.http.get(`${this.baseUrl}/checklists/${userId}`, {
      params,
      withCredentials: true
    }).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  markStepComplete(userId: string, type: string, step: string): Observable<any> {
    const params = { type, step };
    return this.http.post(`${this.baseUrl}/checklists/${userId}/complete-step`, null, { params, withCredentials: true })
      .pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data
        }))
      );
  }
}
