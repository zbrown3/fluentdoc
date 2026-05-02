import { Component, Input } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

export interface ButtonToggle {
  ariaLabel?: string;
  ariaLabelledby?: string | null;
  disabled?: boolean;
  icon?: string;
  isActive?: boolean;
  label?: string;
  name?: string;
  onClick?: (value: string) => void;
  value: string;
}

@Component({
  selector: 'app-fdds-button-toggle',
  standalone: true,
  imports: [MatButtonToggleModule, NgClass, NgFor],
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss'],
})
export class ButtonToggleComponent {
  @Input() buttonToggles: ButtonToggle[] = [];
  @Input() currentValue: string = '';
  @Input() disabled: boolean = false;
}
