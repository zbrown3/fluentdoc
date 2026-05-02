import {Component, OnDestroy} from "@angular/core";
import {BsModalRef} from "ngx-bootstrap/modal";
import {NgOptimizedImage} from "@angular/common";


@Component({
  selector: 'app-linked-account-modal',
  standalone: true,
  templateUrl: './linked-account-modal.component.html',
  imports: [
    NgOptimizedImage
  ],
  styleUrls: ['./linked-account-modal.component.scss']
})
export class LinkedAccountModalComponent implements OnDestroy {

    constructor(protected bsModalRef: BsModalRef) {
    }

    closeLinkedAccountModal() {
      // clear localStorage value
      localStorage.removeItem('linkedAccount');
      this.bsModalRef.hide();
    }

    // on destroy, delete localStorage value
    ngOnDestroy() {
      localStorage.removeItem('linkedAccount');
    }

}
