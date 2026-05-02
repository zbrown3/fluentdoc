import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from "../../../environments/environment";
import {map} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {CookieService} from "ngx-cookie-service";
import {SocialAuthService} from "@abacritt/angularx-social-login";

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {

    baseUrl = environment.baseUrl;
    authObj: any = {};
    user: any = {};

    constructor(private http: HttpClient,
                private router: Router,
                private cookieService: CookieService,
                private toastr: ToastrService,
                private socialAuthService: SocialAuthService) {}

    login(loginData: any) {
        return this.http.post(this.baseUrl + '/auth/login', null, {params: loginData}).pipe(
          map((response: any) => ({
            status: response.status,
            data: response.data
          })
        ));
    }

    register(registerData: any) {
        return this.http.post(this.baseUrl + '/auth/register', registerData).pipe(
          map((response: any) => ({
            status: response.status,
            data: response.data
          })
        ));
    }

    logout() {
      this.socialAuthService.signOut();
      return this.http.get(this.baseUrl + '/auth/logout', { withCredentials: true });
    }

    /**
     * Authenticate Google User through server
     * @param idToken
     * @param email
     */
    googleAuth(idToken: string, email: string) {
        const googleAuthRequest = {
            'idToken': idToken,
            'email': email
        };
        return this.http.post(this.baseUrl + '/auth/google-login', googleAuthRequest).pipe(
          map((response: any) => ({
            status: response.status,
            data: response.data
          }))
        );
    }

    /**
     * Send Reset Password Email
     * @param emailObject
     */
    sendResetPasswordEmail(emailObject: any) {
      return this.http.post(this.baseUrl + '/auth/reset-password-request', emailObject).subscribe({});
    }

    /**
     * reset user password
     * @param keyPasswordObject
     */
    resetPassword(keyPasswordObject: any) {
      return this.http.post(this.baseUrl + '/auth/reset-password', keyPasswordObject).pipe(
        map((response: any) => ({
          status: response.status,
          data: response.data
        }))
      );
    }

}
