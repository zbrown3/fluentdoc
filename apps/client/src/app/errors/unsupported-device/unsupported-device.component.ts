import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APP_WEBSITE } from '../../../utils/constants';

@Component({
  selector: 'app-unsupported-device',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './unsupported-device.component.html',
  styleUrls: ['./unsupported-device.component.scss'],
})
export class UnsupportedDeviceComponent {
  // Add your code here

  constructor(private router: Router) {}

  goToWebsite() {
    window.location.href = APP_WEBSITE;
  }
}
