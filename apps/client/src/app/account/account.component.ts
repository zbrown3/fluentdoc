import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../services/user-service/user.service';
import {ToastrService} from 'ngx-toastr';
import {NgClass} from '@angular/common';
import {BS_MODAL_CONFIG} from '../common/utils/constants';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {NotificationSettingsComponent} from './notification-settings/notification-settings.component';
import {SecurityInfoComponent} from './security-info/security-info.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NgxSpinnerService} from 'ngx-spinner';
import {LoadingSpinnerComponent} from '../../components/loading-spinner/loading-spinner.component';
import {getFormattedReadableDate} from '../../utils/utils';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    TooltipModule,
    NotificationSettingsComponent,
    LoadingSpinnerComponent
  ],
  providers: [UserService],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  loading = true;

  response: any;
  activeTab: string = 'account';
  // Local user object to use
  user: any = {};
  editUser: any = {};
  deleteConfirmation: string = '';

  constructor(private userService: UserService,
              private toastr: ToastrService,
              private bsModalService: BsModalService,
              protected bsModalRef: BsModalRef,
              private router: Router,
              private spinner: NgxSpinnerService) {
  }

  // function to change tab
  changeTab(section: string) {
    this.activeTab = section;
  }

  ngOnInit() {
    this.spinner.show();
    const userId: string | null = localStorage.getItem('userId');
    if (!userId) {
      this.spinner.hide();
      this.loading = false;
      return;
    }
    this.userService.getUserAccountDetails(userId).subscribe({
      next: (response: any) => {
        this.response = response;
        this.user = this.response['data'];
        this.editUser = {...this.user};
        this.spinner.hide();
        this.loading = false;
      }
    });
  }

  openPasswordResetModal = () => {
    this.bsModalRef = this.bsModalService.show(SecurityInfoComponent, BS_MODAL_CONFIG);
  }

  /** Desktop app: no server account; just navigate to dashboard */
  deleteAccount = () => {
    this.router.navigate(['/dashboard']);
  }

  formatDate(date: string) {
    return getFormattedReadableDate(date);
  }

  protected readonly open = open;
}
