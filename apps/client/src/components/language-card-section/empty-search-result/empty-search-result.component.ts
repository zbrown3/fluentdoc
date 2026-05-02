import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-empty-search-result',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './empty-search-result.component.html',
  styleUrls: ['./empty-search-result.component.scss'],
})
export class EmptySearchResultComponent {
  @Output() deleteLanguageSearchEvent = new EventEmitter<string>();

  constructor() {}

  clearSearchAndFilters() {
    this.deleteLanguageSearchEvent.emit('');
  }
}
