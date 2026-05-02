import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { NavComponent } from './nav/nav.component';
import { APP_ROUTES, MIN_WINDOW_SIZE } from '../utils/constants';
import { PreviousRouteService } from './services/previous-route-service/previous-route-service.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SocialLoginModule,
    NgIf,
    NavComponent,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  protected isVisible = true;
  private bpoSubscription: Subscription = new Subscription();
  private browserSubscription: Subscription = new Subscription();
  previousRouteService = inject(PreviousRouteService);
  currentPageRoute = APP_ROUTES.LOGIN.path;

  title = 'fluentdoc-client';
  noNavRoutes = [
    APP_ROUTES.LOGIN.path,
    APP_ROUTES.WELCOME.path,
    APP_ROUTES.ONBOARDING.path,
    APP_ROUTES.RESET_PASSWORD.path,
    APP_ROUTES.ERROR_PAGE_NOT_FOUND.path,
    APP_ROUTES.ERROR_UNSUPPORTED_DEVICE.path,
  ];
  publicDynamicRoutes = [
    APP_ROUTES.PREVIEW_LANGUAGE.path,
    APP_ROUTES.VIEW_LANGUAGE.path,
  ];

  constructor(
    private router: Router,
    private deviceDetectorService: DeviceDetectorService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    const isPublicRoute =
      window.location.pathname.includes(APP_ROUTES.PREVIEW_LANGUAGE.path) ||
      window.location.pathname.includes(APP_ROUTES.VIEW_LANGUAGE.path);

    this.previousRouteService.urlChanged.subscribe(
      ({ previousUrl, currentUrl, browserRefreshed }) => {
        this.bpoSubscription = this.breakpointObserver
          .observe([`(min-width: ${MIN_WINDOW_SIZE}px)`])
          .subscribe((state) => {
            // If the route is not a public route, check if the window width is less than 768px
            // and if so, redirect to the "Unsupported Device" error page
            if (!isPublicRoute) {
              if (state.matches) {
                // If the previous page was the "Unsupported Device" error page caused by the
                // user resizing their browser window, redirect them back to the route they were
                // on while resizing; otherwise, take them to the next expected route
                let routeToRedirectTo =
                  currentUrl === APP_ROUTES.ERROR_UNSUPPORTED_DEVICE.path
                    ? previousUrl
                    : currentUrl;

                // If the page was refreshed, keep the user on the same route which is saved in
                // local storage
                if (browserRefreshed) {
                  routeToRedirectTo = currentUrl;
                }

                // Prevent redundant navigation
                if (
                  !browserRefreshed &&
                  this.router.url !== routeToRedirectTo
                ) {
                  setTimeout(() => {
                    this.router.navigate([routeToRedirectTo]);
                  });
                }
              } else {
                // Navigate to the Unsupported Device error page is the window width is < 768px
                this.isVisible = false;
                this.router.navigate([
                  APP_ROUTES.ERROR_UNSUPPORTED_DEVICE.path,
                ]);
              }
            }
          });
      }
    );

    // Detecting if the user is on a mobile device
    const isMobile = this.deviceDetectorService.isMobile();

    // If user is on mobile device or tablet/desktop on a smaller browser
    // window, redirect them to the Unsupported Device page
    if (isMobile && !isPublicRoute) {
      console.warn('Unsupported screen size and/or device detected.');
      this.router.navigate([APP_ROUTES.ERROR_UNSUPPORTED_DEVICE.path]);
    }
  }

  ngOnDestroy() {
    this.bpoSubscription.unsubscribe();
    this.browserSubscription.unsubscribe();
  }

  // determine whether we're on the login page or not
  showNavBar() {
    // if routerUrl contains dynamic path, don't show navbar
    if (
      this.publicDynamicRoutes.some((route) => this.router.url.includes(route))
    ) {
      return false;
    }

    // only compare root route without query params
    // (i.e. /login?returnUrl=/dashboard should still show the navbar)
    return !this.noNavRoutes.includes(this.router.url.split('?')[0]);
  }
}
