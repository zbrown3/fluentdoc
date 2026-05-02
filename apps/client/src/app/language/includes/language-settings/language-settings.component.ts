import {Component, Input, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {SUCCESS_STATUS} from "../../../common/utils/constants";
import {LanguageService} from "../../../services/language-service/language.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user-service/user.service";
import {TooltipModule} from "ngx-bootstrap/tooltip";
/** CODE HIGHLIGHT::
 * This component is a dynamically loaded component that communicates to the parent component via events.
 * The event is set via "setDismissReason" method from the modalService.
 * the parent component can listen to this event and trigger an event accordingly.
 * This event also accepts data via {initialState} - in this case it's @Input language.
 */
@Component({
  selector: 'app-language-settings',
  standalone: true,
  templateUrl: './language-settings.component.html',
  imports: [
    FormsModule,
    TooltipModule
  ],
  providers: [LanguageService, UserService],
  styleUrls: ['./language-settings.component.scss']
})
export class LanguageSettingsComponent implements OnInit {
  @Input() language: any = {};
  editLanguage: any = {};
  deleteConfirmation: string = '';
  isLanguageSharingEnabled: boolean = true;


  constructor(private bsModalRef: BsModalRef,
              private router: Router,
              private modalService: BsModalService,
              private languageService: LanguageService,
              private userService: UserService,
              private toastr: ToastrService) {
  }

  closeSettings() {
    // let parent component know we're dismissing the modal
    this.modalService.setDismissReason('dismiss')
    this.bsModalRef.hide();
  }

  ngOnInit(): void {
    this.editLanguage = {...this.language};
  }

  onPrivacyLevelChange(value: string): void {
    this.editLanguage.privacyLevel = value;
  }

  saveSettings() {
    const settingsRequest = {
      privacyLevel: this.editLanguage.privacyLevel.toUpperCase(),
    }

    this.bsModalRef.hide();
    this.languageService.updateLanguageSettings(this.language.id, settingsRequest).subscribe({
      next: (response: any) => {
        if (response.status === SUCCESS_STATUS) {
          this.editLanguage = response.data;
          // update privacy level of language
          this.language.privacyLevel = this.editLanguage.privacyLevel;
          this.toastr.success('Language settings successfully updated');

          // let parent component know that we're saving the settings
          this.modalService.setDismissReason('save')
          this.bsModalRef.hide();
        } else {
          // let parent component know that we're just dismissing the modal
          this.modalService.setDismissReason('dismiss')
          this.bsModalRef.hide();
          this.toastr.error('There was an issue updating your language settings. Please try again later.');
        }
      }
    });
  }

  // Delete language
  deleteLanguage() {
    this.userService.deleteLanguage(this.language.id).subscribe({
      next: (response) => {
        if (response.status === SUCCESS_STATUS) {
          this.router.navigate(['/dashboard']).then(() => {
            this.bsModalRef.hide();
            this.toastr.success('Your language has been successfully deleted.');
          });
        } else {
          this.toastr.error('There was an issue deleting your language. Please try again later.');
        }
      }
    });
  }

}
