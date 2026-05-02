import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
})
export class MobileMenuComponent {
  @Output() notificationsClicked = new EventEmitter<void>();
  @Output() logoutClicked = new EventEmitter<void>();
  @Output() navigateToFluentDoc = new EventEmitter<void>();
  @Input() uncheckedNotifications: { length: number } | any = {};
  @Input() isLoggedIn: boolean = false;
  isMobileMenuOpen: boolean = false;

  constructor(private router: Router) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMenu() {
    this.isMobileMenuOpen = false;
  }

  onNotificationsClick() {
    this.notificationsClicked.emit();
    this.isMobileMenuOpen = false;
  }

  onLogoutClicked() {
    this.logoutClicked.emit();
    this.isMobileMenuOpen = false;
  }

  onFluentDocClicked() {
    this.navigateToFluentDoc.emit();
    this.isMobileMenuOpen = false;
  }
}
