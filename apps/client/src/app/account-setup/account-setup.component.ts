import { Component } from '@angular/core';
import {NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {RouterLink} from "@angular/router";
import {UserService} from "../services/user-service/user.service";
import {ToastrService} from "ngx-toastr";
import {SUCCESS_STATUS} from "../common/utils/constants";
import {FaIconComponent, FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {faCheckCircle, faThumbsDown, faThumbsUp, faTimesCircle} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-account-setup',
  standalone: true,
    imports: [
        NgClass,
        NgIf,
        RouterLink,
        NgOptimizedImage,
        FaIconComponent
    ],
  providers: [UserService],
  templateUrl: './account-setup.component.html',
  styleUrls: ['./account-setup.component.scss']
})
export class AccountSetupComponent {

  step: number = 1;
  experience: string = '';
  shareLanguage: any;
  collaborative: any;
  error: boolean = false;
  response: any;

  constructor(private userService: UserService,
              private toastr: ToastrService,
              library: FaIconLibrary) {
    library.addIcons(
      faCheckCircle,
      faTimesCircle,
      faThumbsUp,
      faThumbsDown
    );
  }

  selectExperience(experience: string) {
    this.experience = experience;
  }

  stepBack() {
    this.step--;
  }

  submit() {
    const data = {
      'experience': this.experience,
      'shareLanguage': this.shareLanguage,
      'collaborative': this.collaborative
    };
    const userId: string | null = localStorage.getItem('userId');
    this.userService.updateAccountSetupInfo(userId, data).subscribe({
      next: (response) => {
        this.response = response;
        if (this.response.status === SUCCESS_STATUS) {
          this.toastr.success('Account setup complete.');
        } else {
          this.toastr.error('Error setting up account. We\'ll try again next time you login.');
        }
      },
      error: () => {
        this.error = true;
        this.toastr.error('Error setting up account. We\'ll try again next time you login.');
      }
    })
  }

}
