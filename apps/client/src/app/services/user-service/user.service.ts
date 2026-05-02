import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;

  private planTypeSubject = new BehaviorSubject<string | null>(null);
  planTypeData = this.planTypeSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  setPlanTypeData(data: string | null) {
    this.planTypeSubject.next(data);
  }

  // get user profileInfo
  getUserProfileInfo(id: string | null) {
    // map response as well as set _profileInfo to response.data
    return this.http.get(this.baseUrl + '/users/' + id + '/profile', {withCredentials: true}).pipe(
      map((response: any) => {
        return {
          status: response.status,
          data: response.data
        };
      })
    );
  }

  // get user dashboard info
  getUserDashboard(id: string | null) {
    return this.http.get(this.baseUrl + '/users/' + id + '/dashboard', {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  // get user profile image
  getUserProfileImage(id: string | null) {
    return this.http.get(this.baseUrl + '/users/' + id + '/profile-image', {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  // update user information
  updateUser(id: string, updateUser: any): Observable<any> {
    return this.http.put(this.baseUrl + '/users/' + id + '/profile', updateUser, {withCredentials: true}).pipe(
      map((response: any) => {
        return {
          status: response.status,
          data: response.data
        };
      })
    );
  }

  // update user password
  updatePassword(id: string | null, passwordObject: any) {
    return this.http.put(this.baseUrl + '/users/' + id + '/password', passwordObject, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  // update user email
  updateEmail(id: string, emailRequest: any) {
    return this.http.put(this.baseUrl + '/users/' + id + '/email', emailRequest, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      })));
  }

  // add language for user
  addLanguage(language: any) {
    return this.http.post(this.baseUrl + '/languages', language, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      })));
  }

  // delete language
  deleteLanguage(id: string) {
    return this.http.delete(this.baseUrl + '/languages/' + id, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  // delete user
  deleteUser(id: string) {
    return this.http.delete(this.baseUrl + '/users/' + id, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  // update email Notification settings
  updateEmailNotificationSettings(id: string | null, notificationsObject: any) {
    return this.http.put(this.baseUrl + '/users/' + id + '/notification-settings', notificationsObject, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  // get email notification settings
  getUserNotificationSettings(id: string | null) {
    return this.http.get(this.baseUrl + '/users/' + id + '/notification-settings', {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  // get user account details
  getUserAccountDetails(id: string | null) {
    return this.http.get(this.baseUrl + '/users/' + id + '/account-details', {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      })));
  }

  // get language details
  getLanguage(languageId: string) {
    return this.http.get(this.baseUrl + '/languages/' + languageId, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  // get user notifications
  getNotifications(id: string) {
    return this.http.get(this.baseUrl + '/users/' + id + '/notifications', {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  // update notification viewed data
  updateNotification(id: string | null, notificationId: string) {
    const notificationData = {
      'notificationId': notificationId
    };
    return this.http.put(this.baseUrl + '/users/' + id + '/notifications', notificationData, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  // remove notification
  removeNotification(id: string | null, notificationId: string) {
    return this.http.delete(this.baseUrl + '/users/' + id + '/notifications/' + notificationId, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      }))
    );
  }

  // update welcome info data
  updateAccountSetupInfo(id: string | null, data: any) {
    return this.http.put(this.baseUrl + '/users/' + id + '/account-setup', data, {withCredentials: true}).pipe(
      map((response: any) => ({
        status: response.status,
        data: response.data
      })));
  }

}
