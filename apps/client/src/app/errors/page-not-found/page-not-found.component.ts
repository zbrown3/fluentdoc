import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../../utils/constants';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  // Add your code here

  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate([APP_ROUTES.DASHBOARD.path]);
  }
}
