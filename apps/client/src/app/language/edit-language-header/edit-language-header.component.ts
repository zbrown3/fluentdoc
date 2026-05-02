import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrService } from 'ngx-toastr';

import { ExportOrShareModalComponent } from '../../../components/export-or-share-modal/export-or-share-modal.component';

import {
  APP_ROUTES,
  PDF_EXPORT_TYPES,
  PLAN_TYPES,
  PRIVACY_LEVELS,
} from '../../../utils/constants';
import { type Language } from '../../../utils/types';

@Component({
  selector: 'app-edit-language-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ExportOrShareModalComponent, NgClass, RouterLink, TooltipModule],
  templateUrl: './edit-language-header.component.html',
  styleUrls: ['./edit-language-header.component.scss'],
})
export class EditLanguageHeaderComponent implements OnInit, OnChanges {
  isUnlocked: boolean = false;
  exportLanguageSource = PDF_EXPORT_TYPES.LANGUAGE_GUIDE.key;

  constructor(private router: Router, private toastr: ToastrService) {}

  @Input() isSharedLanguageFeatureEnabled: boolean = false;
  @Input() isWorldBuildingStoryPage: boolean = false;
  @Input() language: any;
  @Input() planType!: string;
  @Output() backButtonEvent = new EventEmitter();
  @Output() exportAndShareLanguageEvent = new EventEmitter<Language>();
  @Output() languageExportedEvent = new EventEmitter();

  ngOnInit(): void {
    this.isUnlocked = this.language.privacyLevel === PRIVACY_LEVELS.PUBLIC;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['language']) {
      this.isUnlocked =
        changes['language'].currentValue.privacyLevel === PRIVACY_LEVELS.PUBLIC;
    }
  }

  goBack(): void {
    if (this.isWorldBuildingStoryPage) {
      this.backButtonEvent.emit();
    } else {
      this.router.navigate([APP_ROUTES.DASHBOARD.path]);
    }
  }

  isStarterPlan(): boolean {
    return this.planType === PLAN_TYPES.STARTER;
  }

  copyShareLink(): void {
    const currentLanguageShareLink = `${window.location.origin}/view/${this.language.id}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentLanguageShareLink).then(
        () => {
          this.toastr.success('Link copied to clipboard!');
        },
        () => {
          this.toastr.error('Failed to copy link.');
        }
      );
    }
  }

  openPreviewLanguageTab() {
    window.open(`/preview/${this.language.id}`, '_blank');
  }

  updateShareLanguagePrivacyLevel(updatedLanguage: Language) {
    this.exportAndShareLanguageEvent.emit(updatedLanguage);
  }

  updateLanguageExported() {
    this.languageExportedEvent.emit();
  }
}
