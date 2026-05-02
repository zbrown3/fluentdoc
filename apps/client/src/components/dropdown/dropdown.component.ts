import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

export interface Option {
  label: string;
  value: any;
  icon?: string;
}
@Component({
  selector: 'app-fdds-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, NgFor],
  providers: [],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  showDropdownMenu: boolean = false;
  selectedOption: Option = {
    label: '',
    value: '',
  };

  constructor() {}

  @Input() disabled: boolean = false;
  @Input() options: Option[] = [];
  @Input() placeholder: string = '';
  @Input() selected: Option = {
    label: '',
    value: '',
  };
  @Output() selectedOptionEvent = new EventEmitter<Option>();

  ngOnInit(): void {
    if (this.selected) {
      this.selectedOption = this.selected;
    }
  }

  toggleDropdownMenu() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  dropdownItemSelected(selectedOption: Option) {
    this.selectedOption = selectedOption;
    this.showDropdownMenu = false;
    this.selectedOptionEvent.emit(this.selectedOption);
  }
}
