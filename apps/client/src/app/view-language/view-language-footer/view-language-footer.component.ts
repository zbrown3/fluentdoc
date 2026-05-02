import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { SocialInteractionsComponent } from '../social-interactions/social-interactions.component';
import { type LanguageStats } from '../../../utils/types';

@Component({
  selector: 'app-view-language-footer',
  standalone: true,
  imports: [NgClass, SocialInteractionsComponent],
  providers: [],
  templateUrl: './view-language-footer.component.html',
  styleUrls: ['./view-language-footer.component.scss'],
})
export class ViewLanguageFooterComponent {
  @Input() showMenu: boolean = false;
  @Input() languageStats: LanguageStats = {
    comments: 0,
    likes: 0,
    stars: 0,
  };

  constructor() {}
}
