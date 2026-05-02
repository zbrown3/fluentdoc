import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-unsaved-changes-modal',
  standalone: true,
  imports: [FormsModule, NgClass],
  providers: [],
  templateUrl: './unsaved-changes-modal.component.html',
  styleUrls: ['./unsaved-changes-modal.component.scss'],
})
export class UnsavedChangesModalComponent {
  constructor() {}

  @Input() primaryActionButtonLabel?: string = '';
  @Input() description?: string = '';
  @Output() confirmUnsavedChangesEvent = new EventEmitter<any>();

  // emit the confirmUnsavedChangesEvent to call the function passeed in
  handleConfirmedUnsavedChanges() {
    this.confirmUnsavedChangesEvent.emit();
  }
}
