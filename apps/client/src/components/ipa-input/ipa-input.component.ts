import {Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from "@angular/core";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {IpaSelectorComponent} from "../ipa-selector/ipa-selector.component";
import {NgClass, NgIf} from "@angular/common";

// CODE HIGHLIGHT: this code updates the parent ngModel when the user selects a character from the IPA selector
// inside of providers, the NG_VALUE_ACCESSOR is provided to the component, which allows the component to be used with ngModel
@Component({
  selector: 'app-ipa-input',
  standalone: true,
  templateUrl: './ipa-input.component.html',
  imports: [
    ReactiveFormsModule,
    IpaSelectorComponent,
    NgIf,
    NgClass
  ],
  styleUrls: ['./ipa-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IpaInputComponent),
      multi: true
    }
  ]
})
export class IpaInputComponent implements ControlValueAccessor, OnInit {

  @Input() name: string = '';
  textControl = new FormControl('');
  @ViewChild('textInput') inputRef!: ElementRef<HTMLInputElement>;
  showSelector = false;
  @Input() ngClass: any;

  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  ngOnInit(): void {
    this.textControl.valueChanges.subscribe((value) => {
      this.onChange(value || '');
    });
  }

  writeValue(value: string): void {
    this.textControl.setValue(value || '', { emitEvent: false }); // prevent infinite loop
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.textControl.disable();
    } else {
      this.textControl.enable();
    }
  }

  closeSelector() {
    this.showSelector = false;
  }

  handleCharacterSelect(char: string) {
    const inputElement = this.inputRef.nativeElement;
    if (!inputElement) return;

    const start = inputElement.selectionStart || 0;
    const end = inputElement.selectionEnd || 0;
    const currentText = this.textControl.value || '';

    const newText = currentText.slice(0, start) + char + currentText.slice(end);
    this.textControl.setValue(newText); // this now automatically calls onChange via valueChanges

    setTimeout(() => {
      const newPosition = start + char.length;
      inputElement.setSelectionRange(newPosition, newPosition);
      inputElement.focus();
    }, 0);
  }
}
