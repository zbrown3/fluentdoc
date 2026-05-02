import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { type Language } from '../../utils/types';

@Component({
  selector: 'app-delete-language-confirmation-modal',
  standalone: true,
  imports: [FormsModule],
  providers: [],
  templateUrl: './delete-language-confirmation-modal.component.html',
  styleUrls: [],
})
export class DeleteLanguageConfirmationModalComponent {
  deleteConfirmation: string = '';

  constructor(protected bsModalRef: BsModalRef) {}

  @Input() languageToDelete: Language | any = {};
  @Output() deleteConfirmedEvent = new EventEmitter<string>();

  // Confirm delete
  confirmDelete() {
    this.deleteConfirmedEvent.emit(this.languageToDelete.id);

    // Resetting delete confirmation string to clear the field
    this.deleteConfirmation = '';
    this.bsModalRef.hide();
  }
}
