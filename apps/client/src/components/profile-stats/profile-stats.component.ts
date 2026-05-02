import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UserStats {
  numberOfLanguages?: number;
  numberOfWords?: number;
  numberOfPhrases?: number;
  numberOfFollowers?: number;
}

@Component({
  selector: 'app-profile-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.scss']
})
export class ProfileStatsComponent {
  @Input() userStats!: UserStats;
  @Input() showFollowers: boolean = true;
  @Input() showLanguages: boolean = true;
  @Input() showWords: boolean = true;
  @Input() showPhrases: boolean = true;
} 