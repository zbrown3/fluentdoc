import {Component, forwardRef, Input, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { IpaSelectorComponent } from '../ipa-selector/ipa-selector.component';
import {QUILL_CONFIG} from "../../app/common/utils/constants";

// CODE HIGHLIGHT: this code updates the parent ngModel when the user selects a character from the IPA selector
// inside of providers, the NG_VALUE_ACCESSOR is provided to the component, which allows the component to be used with ngModel
@Component({
  selector: 'app-ipa-quill-editor',
  standalone: true,
  templateUrl: './ipa-quill-editor.component.html',
  styleUrls: ['./ipa-quill-editor.component.scss'],
  imports: [
    QuillEditorComponent,
    IpaSelectorComponent,
    FormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IpaQuillEditorComponent),
      multi: true
    }
  ]
})
export class IpaQuillEditorComponent implements ControlValueAccessor, AfterViewInit {

  loading = true;

  @Input() name: string = '';
  @ViewChild('quillEditor') quillEditor!: QuillEditorComponent;

  // dynamic properties
  @Input() placeholderInput = 'Insert text here...';
  @Input() editorHeight = 45; // Change this value dynamically if needed
  @Input() editorMinHeight = 45;

  showSelector = false;
  private quillInstance: any;
  private pendingValue: string | null = null; // Store initial value temporarily
  protected readonly quillConfig = {
    toolbar: {
      container: [
        ...QUILL_CONFIG.toolbar.container, // Default Quill toolbar
        ['ipaKeyboard'] // Custom IPA Keyboard Button
      ],
      handlers: {
        ipaKeyboard: () => this.toggleIpaSelector() // Custom handler for the button
      }
    }
  };

  constructor(private cdRef: ChangeDetectorRef) {}

  toggleIpaSelector() {
    // Toggle the state
    this.showSelector = !this.showSelector;

    // Force Angular to detect the change immediately
    this.cdRef.detectChanges(); //
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};


  setQuillInstance(editor: any) {
    if (!editor) return;
    this.quillInstance = editor;

    // Apply pending value if it was set before initialization
    if (this.pendingValue !== null && this.quillInstance) {
      this.quillInstance.root.innerHTML = this.pendingValue;
      this.pendingValue = null; // Clear after setting
    }

    // Listen for content changes
    if (!this.quillInstance) return;
    this.quillInstance.on('text-change', () => {
      const content = this.quillInstance.root.innerHTML;
      this.onChange(content);
    });

    // Ensure the IPA Keyboard button is added after Quill initializes
    setTimeout(() => this.addIpaKeyboardToToolbar(), 100);
    this.loading = false; // 🛑 Hide spinner when Quill is ready
  }

  addIpaKeyboardToToolbar() {
    const toolbar = document.querySelector('.ql-toolbar');
    if (toolbar) {
      const ipaButton = toolbar.querySelector('.ql-ipaKeyboard') as HTMLButtonElement;

      if (ipaButton) {
        ipaButton.innerHTML = `<i class="ph ph-keyboard"></i> IPA Keyboard`;
        ipaButton.style.display = 'flex';
        ipaButton.style.alignItems = 'center';
        ipaButton.style.gap = '5px'; // Space between icon and text
        ipaButton.style.padding = '5px 10px';
        ipaButton.style.fontSize = '12px';
        ipaButton.style.fontWeight = 'bold';
        ipaButton.style.width = 'max-content';
        ipaButton.style.color = '#364dca';
      }
    } else {
      console.warn('⚠️ Quill toolbar not found, retrying...');
      setTimeout(() => this.addIpaKeyboardToToolbar(), 100); // Retry after a short delay
    }
  }

  writeValue(value: string): void {
    if (this.quillInstance) {
      this.quillInstance.root.innerHTML = value || '';
      this.loading = false; // 🛑 Hide spinner when Quill is ready
    } else {
      // Store the value for later when Quill is ready
      this.pendingValue = value;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.quillInstance) {
      this.quillInstance.enable(!isDisabled);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.quillEditor) {
        this.setQuillInstance(this.quillEditor.quillEditor);
      } else {
        console.error('❌ Quill editor instance not found!');
      }
    }, 100);
  }

  closeSelector() {
    this.showSelector = false;

    // Ensure focus goes back to Quill editor
    setTimeout(() => {
      if (this.quillInstance) {
        this.quillInstance.focus();
      }
    });
  }

  handleCharacterSelect(char: string) {
    if (!this.quillInstance) return;

    const range = this.quillInstance.getSelection();
    if (!range) {
      // If the selection is null, move the cursor to the end
      const length = this.quillInstance.getLength();
      this.quillInstance.setSelection(length, 0);
    }

    const newRange = this.quillInstance.getSelection();
    if (newRange) {
      this.quillInstance.insertText(newRange.index, char);

      // Move cursor forward after inserting
      this.quillInstance.setSelection(newRange.index + char.length);

      // Trigger form update
      this.onChange(this.quillInstance.root.innerHTML);
    }
  }
}
