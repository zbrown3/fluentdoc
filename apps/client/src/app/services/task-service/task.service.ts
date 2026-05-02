import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  // get language details
  getUserTasks(id: string | null) {
    return this.http.get(this.baseUrl + '/tasks/' + id, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  addTask(taskData: { task: any; creatorId: string }) {
    return this.http.post(this.baseUrl + '/tasks', taskData, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      })));
  }

  deleteTask(id: string) {
    const userId = localStorage.getItem('userId');
    return this.http.delete(this.baseUrl + '/tasks/' + userId + '/' + id, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      })));
  }

  completeTask(checked: boolean, id: any) {
     const requestObject = {
         complete: checked,
         taskId: id
     };
     const userId = localStorage.getItem('userId');
      return this.http.put(this.baseUrl + '/tasks/' + userId + '/' + id, requestObject, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      })));
  }
}
