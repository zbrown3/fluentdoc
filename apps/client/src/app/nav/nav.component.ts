import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user-service/user.service';
import { NotificationModalComponent } from '../../components/notification-modal/notification-modal.component';
import { BS_MODAL_CONFIG } from '../common/utils/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PLAN_TYPES } from '../../utils/constants';
import { catchError, forkJoin, of } from 'rxjs';
import { PROFILE_IMAGE_BACKGROUND_DEFAULT } from '../../utils/constants';
import { NgStyle } from '@angular/common';
import { MobileMenuComponent } from "./mobile-menu/mobile-menu.component";
import { BreakpointObserver } from '@angular/cdk/layout';
import { MIN_WINDOW_SIZE } from '../../utils/constants';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, TooltipModule, NgStyle, MobileMenuComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  loading: boolean = true;
  profileImageUrl: string | null = null;
  profileImageBgColor: string | null = null;
  planType: any;
  response: any;
  notifications: any;
  uncheckedNotifications: any;
  /** Desktop app: always true; no auth required */
  isLoggedIn: boolean = true;
  isMobile: boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private bsModalService: BsModalService,
    protected bsModalRef: BsModalRef,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit() {
    const userId: any = localStorage.getItem('userId');

    this.breakpointObserver
      .observe([`(max-width: ${MIN_WINDOW_SIZE}px)`])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });

    // subscribe to reactive plan type updates
    this.userService.planTypeData.subscribe((planType) => {
      if (planType) {
        this.planType = planType;
        this.cdRef.detectChanges();
      }
    });

    // Desktop app: skip user API calls when no userId
    if (!userId) {
      this.loading = false;
      return;
    }

    const profileImage$ = this.userService.getUserProfileImage(userId).pipe(
      catchError((err) => {
        console.error('Error getting profile image:', err);
        return of(null);
      })
    );

    forkJoin([profileImage$]).subscribe({
      next: ([profileImage]) => {
        if (profileImage) {
          this.response = profileImage;
          const url = profileImage['data']['profileImageUrl'];
          const backgroundColor = profileImage['data']['backgroundColor'];
          this.profileImageUrl = url;
          this.profileImageBgColor = backgroundColor;
        }

        this.planType = PLAN_TYPES.FOUNDING_CREATOR;
        this.userService.setPlanTypeData(PLAN_TYPES.FOUNDING_CREATOR);

        this.getNotifications();
        this.getUncheckedNotifications();
      },
      error: (err) => {
        console.error('Unexpected error in ngOnInit forkJoin:', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  /** Desktop app: no auth; just navigate to dashboard */
  logout() {
    this.router.navigate(['/dashboard']);
  }

  getNotifications() {
    const userId: any = localStorage.getItem('userId');
    if (!userId) return;
    this.userService.getNotifications(userId).subscribe({
      next: (response: any) => {
        this.notifications = response.data.notifications;
        this.uncheckedNotifications = this.notifications.filter(
          (notification: { viewed: any }) => !notification.viewed
        );
      },
    });
  }

  getUncheckedNotifications() {
    if (!this.notifications) return;
    this.uncheckedNotifications = this.notifications.filter(
      (notification: { viewed: any }) => !notification.viewed
    );
  }

  openNotificationModal() {
    const initialState = { notifications: this.notifications };
    this.bsModalRef = this.bsModalService.show(NotificationModalComponent, {
      ...BS_MODAL_CONFIG,
      initialState,
      class: 'modal-dialog-centered modal-md',
    });

    this.bsModalRef.content.update.subscribe(() => {
      this.getUncheckedNotifications();
    });
  }

  navigateToFluentDoc() {
    window.open('https://www.fluentdoc.com/');
  }

  protected readonly PLAN_TYPES = PLAN_TYPES;
  protected readonly BACKGROUND_COLOR_DEFAULT = PROFILE_IMAGE_BACKGROUND_DEFAULT;
}
