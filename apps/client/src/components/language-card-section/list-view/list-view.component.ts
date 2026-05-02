import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { UserService } from '../../../app/services/user-service/user.service';
import { IntroService } from '../../../app/services/intro-service/intro.service';

import {
  DataTableComponent,
  type TableColumn,
} from '../../../components/data-table/data-table.component';
import {
  APP_ROUTES,
  DEFAULT_PAGINATION_CONFIG,
  PRIVACY_LEVELS,
} from '../../../utils/constants';
import {
  getFormattedDate,
  getFormattedTitle,
  getLanguagePurposes,
  getLanguageTypes,
} from '../../../utils/utils';
import { type LanguageType, type Language } from '../../../utils/types';

@Component({
  selector: 'app-dashboard-list-view',
  standalone: true,
  imports: [DataTableComponent, FormsModule, TooltipModule],
  providers: [UserService, IntroService],
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})
export class DashboardListViewComponent {
  @Input() languages: Language[] = [];
  @Input() searchTerm: string = '';
  @Input() isPublicRoute: boolean = false;
  @Input() paginationConfig = DEFAULT_PAGINATION_CONFIG;
  @Output() setDeleteLanguageEvent = new EventEmitter<Language>();

  columns: TableColumn[] = [
    {
      filterable: true,
      key: 'name',
      label: 'Language',
      showTooltip: true,
      sortable: true,
    },
    {
      filterable: false,
      formatDataFn: getFormattedTitle,
      key: 'privacyLevel',
      label: 'Setting',
      sortable: false,
    },
    {
      filterable: true,
      formatDataFn: getLanguagePurposes,
      key: 'reasons',
      label: 'Purposes',
      showTooltip: true,
      sortable: false,
    },
    {
      filterable: true,
      formatDataFn: getLanguageTypes,
      key: 'types',
      label: 'Types',
      showTooltip: true,
      sortable: false,
    },
    {
      filterable: false,
      formatDataFn: this.formatLastEditDate,
      key: 'lastUpdated',
      label: 'Last edited',
      sortable: true,
    },
    {
      actions: [
        {
          label: 'View language',
          icon: '',
          isDelete: false,
          onClick: (rowData: Language) =>
            this.handleNavigation(rowData.id),
          class: 'btn btn-tertiary',
        },
        {
          class: '',
          icon: 'ph-trash',
          isDelete: true,
          isIconButton: true,
          label: 'Delete language',
          onClick: (rowData: Language) => this.handleSetDeleteLanguage(rowData),
        },
      ],
      filterable: false,
      key: 'actions',
      label: 'Actions',
      sortable: false,
    },
  ];

  constructor(
    private router: Router,
    protected bsModalRef: BsModalRef,
    private bsModalService: BsModalService
  ) {}

  formatLastEditDate(dateString: string) {
    return getFormattedDate(dateString);
  }

  getNumberOfLanguageTypesHidden(languageTypes: LanguageType[]) {
    return `+${languageTypes.length - 4} more`;
  }

  // data binding object for language deletion
  handleSetDeleteLanguage(language: any) {
    this.setDeleteLanguageEvent.emit(language);
  }

  handleNavigation(languageId: string) {
    if(!this.isPublicRoute) {
      this.router.navigate([`${APP_ROUTES.LANGUAGE.path}/${languageId}`]);
    } else {
      this.router.navigate([`${APP_ROUTES.VIEW_LANGUAGE.path}/${languageId}`]);
    }
  }

  protected readonly PRIVACY_LEVELS = PRIVACY_LEVELS;
}
