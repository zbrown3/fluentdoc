import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-save-modal',
  standalone: true,
  templateUrl: './save-modal.component.html',
  styleUrls: []
})
export class SaveModalComponent {
  @Input() title = 'Modal Title';
  @Input() disabled = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onSave() {
    this.save.emit();
  }
}
