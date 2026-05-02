import { Component } from '@angular/core';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: ` <ngx-spinner
    [fullScreen]="false"
    bdColor="#ffffff73"
    type="line-scale-pulse-out"
    color="#4460fd"
  ></ngx-spinner>`,
  imports: [NgxSpinnerComponent],
})
export class LoadingSpinnerComponent {}
