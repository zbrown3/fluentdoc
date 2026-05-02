import {Injectable, Provider} from "@angular/core";
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {ToastrService} from "ngx-toastr";

/** Interceptor for HTTP errors. Desktop app: no auth logout on 403. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // handle 400 bad requests and display error message
        if ([400].includes(err.status)) {
          const errorObject = err.error['error'];
          if (errorObject?.message) { this.toastr.error(errorObject?.message); }
        }
        // Desktop app: do not logout or redirect on 403

        // handle 500 errors
        if ([500].includes(err.status)) {
          this.toastr.error('An error occurred. Please try again later.');
        }

        const error = err.error?.message || err.statusText;
        return throwError(() => error);
      })
    );
  }
}

export const authInterceptorProvider: Provider =
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true };
