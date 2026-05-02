import { Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { CreateLanguageComponent } from './create-language/create-language.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GlossaryComponent } from './glossary/glossary.component';
import { LandingComponent } from './landing/landing.component';
import { LanguageComponent } from './language/language.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';
import { ResourcesComponent } from './resources/resources.component';
import { UnsupportedDeviceComponent } from './errors/unsupported-device/unsupported-device.component';
import { ViewLanguageComponent } from './view-language/view-language.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    title: 'FluentDoc',
    component: LandingComponent,
  },
  // @deprecated route
  {
    path: 'welcome',
    title: 'FluentDoc',
    component: AccountSetupComponent,
  },
  {
    path: 'onboarding',
    title: 'FluentDoc',
    component: OnboardingComponent,
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
  },
  {
    path: 'new-language',
    title: 'Create language',
    component: CreateLanguageComponent,
  },
  {
    path: 'language/:languageId',
    title: 'FluentDoc',
    component: LanguageComponent,
  },
  {
    path: 'account',
    title: 'Account',
    component: AccountComponent,
  },
  {
    path: 'resources',
    title: 'Resources',
    component: ResourcesComponent,
  },
  // ACCOUNT MANAGEMENT
  {
    path: 'reset-password',
    component: LandingComponent,
  },
  // MISC
  {
    path: 'glossary',
    title: 'Glossary',
    component: GlossaryComponent,
  },
  {
    path: 'error/unsupported-device',
    component: UnsupportedDeviceComponent,
  },
  {
    path: 'preview/:languageId',
    title: 'Preview language',
    component: ViewLanguageComponent,
  },
  {
    path: 'view/:languageId',
    title: 'View language',
    component: ViewLanguageComponent,
  },
  // otherwise, show the 'Page not found' error page
  {
    path: '**',
    pathMatch: 'full',
    title: 'Page not found',
    component: PageNotFoundComponent,
  },
];
