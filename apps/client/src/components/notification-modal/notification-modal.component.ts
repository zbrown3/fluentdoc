import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from '../../app/services/user-service/user.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from '../../app/services/util-service/utility.service';
import { DatePipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { SUCCESS_STATUS } from '../../app/common/utils/constants';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
  providers: [UserService, UtilityService],
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
})
export class NotificationModalComponent {
  @Input() notifications: any; // we can set the default value also

  @Output() update = new EventEmitter<string>();

  constructor(
    protected bsModalRef: BsModalRef,
    public userService: UserService,
    private toastr: ToastrService
  ) {}

  updateNotificationView(notification: any) {
    if (notification.viewed) {
      return;
    }
    // update viewed data for notification for user
    const userId: string | null = localStorage.getItem('userId');
    this.userService.updateNotification(userId, notification.id).subscribe({
      next: (response: any) => {
        if (response.status === SUCCESS_STATUS) {
          notification.viewed = true;
          this.update.emit();
        }
      },
    });
  }

  removeNotification(notification: any, i: number) {
    // remove notification from user notification list
    const userId: string | null = localStorage.getItem('userId');
    this.userService.removeNotification(userId, notification.id).subscribe({
      next: (response: any) => {
        if (response.status === SUCCESS_STATUS) {
          this.toastr.success('Notification successfully removed.');
          this.update.emit();
          this.notifications.splice(i, 1);
        } else {
          this.toastr.error('There was an error. Please try again later.');
        }
      },
    });
  }
}
