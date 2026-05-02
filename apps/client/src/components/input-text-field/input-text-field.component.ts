import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-fdds-input-text-field',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './input-text-field.component.html',
  styleUrls: ['./input-text-field.component.scss'],
})
export class InputTextFieldComponent {
  constructor(private formBuilder: FormBuilder) {}

  @Input() formObject: FormGroup = this.formBuilder.group({});
  @Input() id: string = '';
  @Input() classNames: string = '';
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() isRequired: boolean = false;
  @Input() inputType: string = 'text';
  @Input() placeholder: string = '';
  @Input() validationType: string | undefined;
  @Input() validationMessage: string = '';

  getValidationIcon() {
    switch (this.validationType) {
      case 'error':
        return 'ph-warning-circle';
      case 'success':
        return 'ph-check-circle';
      default:
        return null;
    }
  }
}
