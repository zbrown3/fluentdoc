import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NgForOf} from "@angular/common";

interface IpaCategory {
  id: string;
  name: string;
  characters: string[];
}

@Component({
  selector: 'app-ipa-selector',
  standalone: true,
  imports: [HttpClientModule, NgForOf],
  templateUrl: './ipa-selector.component.html',
  styleUrls: ['./ipa-selector.component.scss']
})
export class IpaSelectorComponent implements OnInit {
  @Input() ipaCategories: IpaCategory[] = [];
  activeTab: string = '';

  @Output() handleSelect = new EventEmitter<string>();
  @Output() handleClose = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadIpaCategories();
  }

  loadIpaCategories() {
    this.http.get<IpaCategory[]>('/assets/data/ipa-categories.json').subscribe({
      next: (data) => {
        this.ipaCategories = data;
        if (this.ipaCategories.length > 0) {
          this.activeTab = this.ipaCategories[0].id;
        }
      },
      error: (err) => console.error('Error loading IPA categories:', err)
    });
  }

  selectCharacter(char: string) {
    this.handleSelect.emit(char);
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  close() {
    this.handleClose.emit();
  }
}
