import {Component, OnInit} from "@angular/core";
import {LinkedAccountModalComponent} from "../../components/linked-account-modal/linked-account-modal.component";
import {BS_MODAL_CONFIG} from "../common/utils/constants";
import {FaIconComponent, FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {UserService} from "../services/user-service/user.service";
import {ToastrService} from "ngx-toastr";
import {UtilityService} from "../services/util-service/utility.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {NgxSpinnerComponent, NgxSpinnerService} from "ngx-spinner";
import {NavComponent} from "../nav/nav.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {LoadingSpinnerComponent} from "../../components/loading-spinner/loading-spinner.component";
import {FormsModule} from "@angular/forms";
import {
  faArrowAltCircleRight,
  faBell,
  faCaretDown, faEllipsis, faFeather, faLock,
  faPlusCircle,
  faTimesCircle, faUserCircle
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-language-hub',
  standalone: true,
  imports: [
    NavComponent,
    RouterLinkActive,
    RouterLink,
    DatePipe,
    NgIf,
    NgForOf,
    FaIconComponent,
    TooltipModule,
    NgOptimizedImage,
    NgxSpinnerComponent,
    LoadingSpinnerComponent,
    FormsModule
  ],
  providers: [UserService, UtilityService],
  templateUrl: './language-hub.component.html',
  styleUrls: ['./language-hub.component.scss']
})
export class LanguageHubComponent implements OnInit {
  loading = true;
  deleteConfirmation: string = '';

  // // Local user object to use
  user: any = {};
  response: any;
  // Variables being referenced from dashboard
  languageToDelete: any = {};

  constructor(library: FaIconLibrary,
              private userService: UserService,
              private toastr: ToastrService,
              private utilityService: UtilityService,
              protected bsModalRef: BsModalRef,
              private bsModalService: BsModalService,
              private spinner: NgxSpinnerService) {
    library.addIcons(
      faCaretDown,
      faArrowAltCircleRight,
      faTimesCircle,
      faPlusCircle,
      faBell,
      faEllipsis,
      faFeather,
      faUserCircle,
      faLock,
    );
  }

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();
    // get user profile info
    const userId: any = localStorage.getItem('userId');
    // populate profileInfo
    this.userService.getUserProfileInfo(userId).subscribe(
      {
        next: (response) => {
          this.response = response;
          this.user = this.response['data']

          this.spinner.hide();
          this.loading = false;
        }
      }
    );

    // if localStorage has linkedAccount, show modal
    if (localStorage.getItem('linkedAccount')) {
      this.bsModalRef = this.bsModalService.show(LinkedAccountModalComponent, BS_MODAL_CONFIG);
    }

    // TODO: IntoJS logic
    // // if showIntro is in localStorage, check to see if it is true
    // if (localStorage.getItem('showIntro')) {
    //     if (localStorage.getItem('showIntro') === 'true') {
    //         this.intro();
    //     }
    // }
  }

  // capitalize first letter
  capitalizeFLetter(subject: any) {
    return this.utilityService.capitalizeFLetter(subject);
  }

  // formatReason
  formatReason(reason: string) {
    return this.utilityService.formatReason(reason);
  }

  // data binding object for language deletion
  populateLanguage(language: any) {
    this.languageToDelete = language;
  }

  // delete language
  deleteLanguage(languageId: string) {
    this.userService.deleteLanguage(languageId).subscribe({
        next: (response) => {
          this.response = response;
          // update local language object using filter
          if (this.response['status'] === 'SUCCESS') {
            this.user.languages = this.user.languages.filter((language: { id: string; }) => language.id !== languageId);
            this.toastr.success('Language deleted successfully!',);
            this.deleteConfirmation = '';
          } else {
            this.toastr.success('Language deleted successfully!');
            this.deleteConfirmation = '';
          }
        }, error: () => {
          this.toastr.success('Language deleted successfully!');
          this.deleteConfirmation = '';
        }
      }
    );
  }

  displayType(type: any) {
    return this.utilityService.displayType(type);
  }
}
