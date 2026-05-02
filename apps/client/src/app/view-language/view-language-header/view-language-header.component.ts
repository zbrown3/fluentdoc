import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { MadeWithFluentDocComponent } from '../../../components/made-with-fd/made-with-fd.component';

@Component({
  selector: 'app-view-language-header',
  standalone: true,
  imports: [MadeWithFluentDocComponent, NgClass, NgFor],
  providers: [],
  templateUrl: './view-language-header.component.html',
  styleUrls: ['./view-language-header.component.scss'],
})
export class ViewLanguageHeaderComponent {
  overviewSections: any[] = [
    {
      id: 'overview',
      title: 'Overview',
    },
    {
      id: 'dictionary',
      title: 'Dictionary',
    },
    {
      id: 'phrases',
      title: 'Phrases',
    },
    {
      id: 'stories',
      title: 'Stories',
    },
  ];

  activeSectionId: string = this.overviewSections[0].id;
  isCustomizeStylesDrawerOpen: boolean = false;

  constructor() {}
  @Input() flagImageUrl?: string | null = null;
  @Input() languageName: string = '';
  @Input() isEditMode: boolean = false;
  @Input() isPreviewMode: boolean = true;
  @Input() isPublicMode: boolean = false;
  @Input() showLanguageFlag: boolean = false;
  @Input() view: string = '';
  @Output() newViewEvent = new EventEmitter<string>();
  @Output() customizeStylesDrawerToggle = new EventEmitter<boolean>();

  toggleCustomizeStylesDrawer() {
    this.isCustomizeStylesDrawerOpen = !this.isCustomizeStylesDrawerOpen;
    this.customizeStylesDrawerToggle.emit(this.isCustomizeStylesDrawerOpen);
  }

  setActiveSection(sectionId: any) {
    this.activeSectionId = sectionId;

    // emit event to update the view
    this.newViewEvent.emit(sectionId);
  }
}
