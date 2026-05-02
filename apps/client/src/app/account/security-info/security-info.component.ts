import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {BsModalRef} from "ngx-bootstrap/modal";
import {SUCCESS_STATUS} from "../../common/utils/constants";
import {UserService} from "../../services/user-service/user.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-security-info',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  providers: [UserService],
  templateUrl: './security-info.component.html',
  styleUrls: ['./security-info.component.scss']
})
export class SecurityInfoComponent {

  constructor(protected bsModalRef: BsModalRef,
              private userService: UserService,
              private toastr: ToastrService) { }

    password: any = {};
    response: any;


  // update user password
  updatePassword() {
    // TODO: add form validation to this flow to create a better experience for the user
    const passwordObject = {
      'currentPassword': this.password.currentPassword,
      'newPassword': this.password.newPassword
    };

    const userId: string | null = localStorage.getItem('userId');
    return this.userService.updatePassword(userId, passwordObject).subscribe({
      next: (response: any) => {
        this.response = response;
        if (this.response['status'] === SUCCESS_STATUS) {
          this.toastr.success('Password successfully updated!');
        } else {
          this.toastr.error(this.response['error']['message']);
        }
      }, error: () => {
        this.toastr.error('An error occurred. Please try again later.');
      }
    });
  }

}
