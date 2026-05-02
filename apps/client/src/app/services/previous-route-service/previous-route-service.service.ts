import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { APP_ROUTES, FD_STORAGE_KEYS } from '../../../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  private _previousUrl: string = '';
  private _currentUrl: string = '';
  private _browserRefreshed: boolean = false;

  urlChanged: Subject<{
    previousUrl: string;
    currentUrl: string;
    browserRefreshed: boolean;
  }> = new Subject();

  router = inject(Router);

  constructor() {
    this._currentUrl = this.router.url;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this._browserRefreshed = !this.router.navigated;
      }
    });

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this._previousUrl = this._currentUrl;
        this._currentUrl = event.url;

        // If the browser hasn't been refreshed, save the current/previous urls into
        // session storage for usage later
        if (!this._browserRefreshed) {
          sessionStorage.setItem(FD_STORAGE_KEYS.CURRENT_URL, this._currentUrl);
          sessionStorage.setItem(
            FD_STORAGE_KEYS.PREVIOUS_URL,
            this._previousUrl
          );
        }

        const currentUrlFromStorage =
          sessionStorage.getItem(FD_STORAGE_KEYS.CURRENT_URL) ||
          APP_ROUTES.LOGIN.path;
        const previousUrlFromStorage =
          sessionStorage.getItem(FD_STORAGE_KEYS.PREVIOUS_URL) ||
          APP_ROUTES.LOGIN.path;

        // If the browser has been refreshed, we want to take the urls from
        // the session storage due to the state being lost during the refresh;
        // otherwise, get the urls from the router events
        this.urlChanged.next({
          previousUrl: this._browserRefreshed
            ? previousUrlFromStorage
            : this._previousUrl,
          currentUrl: this._browserRefreshed
            ? currentUrlFromStorage
            : this._currentUrl,
          browserRefreshed: this._browserRefreshed,
        });
      });
  }

  getPreviousUrl() {
    return this._previousUrl;
  }

  getPreviousUrlFromStorage() {
    return (
      sessionStorage.getItem(FD_STORAGE_KEYS.PREVIOUS_URL) ||
      APP_ROUTES.LOGIN.path
    );
  }

  getCurrentUrl() {
    return this._currentUrl;
  }

  getCurrentUrlFromStorage() {
    return (
      sessionStorage.getItem(FD_STORAGE_KEYS.CURRENT_URL) ||
      APP_ROUTES.LOGIN.path
    );
  }

  getIsBrowserRefreshed() {
    return this._browserRefreshed;
  }
}
