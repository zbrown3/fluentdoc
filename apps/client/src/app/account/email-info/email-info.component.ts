import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-email-info',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './email-info.component.html',
  styleUrls: ['../../onboarding-profile.component.scss']
})
export class EmailInfoComponent {

  constructor() { }

    @Input() user: any;
    email: string = '';

    @Output() submitEvent = new EventEmitter<string>();

    update() {
        this.submitEvent.emit(this.email);
    }

}
