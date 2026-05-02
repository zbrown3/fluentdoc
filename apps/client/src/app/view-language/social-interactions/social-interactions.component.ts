import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { type LanguageStats } from '../../../utils/types';

@Component({
  selector: 'app-social-interactions',
  standalone: true,
  imports: [NgClass],
  providers: [],
  templateUrl: './social-interactions.component.html',
  styleUrls: ['./social-interactions.component.scss'],
})
export class SocialInteractionsComponent implements OnInit {
  stats: LanguageStats = {
    comments: 0,
    likes: 0,
    stars: 0,
  };

  @Input() buttonVariant: 'tertiary' | 'secondaryGray' = 'tertiary';
  @Input() languageStats: LanguageStats = {};

  constructor() {}

  ngOnInit(): void {
    this.stats = this.languageStats;
  }
}
