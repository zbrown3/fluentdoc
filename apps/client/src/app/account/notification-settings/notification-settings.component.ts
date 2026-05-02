import {Component, Input} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserService} from "../../services/user-service/user.service";
import {ToastrService} from "ngx-toastr";
@Component({
  standalone: true,
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [UserService],
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent {
  response: any;
  @Input() notifications: any = {};

  constructor(private userService: UserService,
              private toastr: ToastrService) {
  }

  updateNotifications() {
    const requestObject = {
      userId: localStorage.getItem('userId'),
      notifications: this.notifications
    };

    const userId: string | null = localStorage.getItem('userId');
    this.userService.updateEmailNotificationSettings(userId, requestObject).subscribe({
      next: (response) => {
        this.response = response;
        if (response) {
          this.notifications = this.response['data']['emailSettings'];
          this.toastr.success('Email preferences successfully updated');
        } else {
          this.toastr.error('There was an error updating your email preferences');
        }
      }, error: () => {
        console.error('There was an error updating your email preferences');
        this.toastr.error('There was an error updating your email preferences');
      }
    });
  }


}
