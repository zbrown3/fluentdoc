import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';

export type VowelKey =
  | 'uu'
  | 'a'
  | 'ae'
  | 'eh'
  | 'er'
  | 'ii'
  | 'i'
  | 'ah'
  | 'e'
  | 'o'
  | 'u'
  | 'ee'
  | 'y'
  | 'ibar'
  | 'ubar'
  | 'vowelw'
  | 'upperY'
  | 'nearu'
  | 'oslant'
  | 'obar'
  | 'backelow'
  | 'voweltwist'
  | 'backE'
  | 'oe'
  | 'roundb'
  | 'backc'
  | 'downa'
  | 'ce'
  | 'backa';

export interface VowelPoint {
  id: VowelKey; // <- matches existing object keys
  symbol: string; // glyph shown
  x: number; // 0–100 inside trapezoid
  y: number; // 0–100 inside trapezoid
  rounded?: boolean; // blue tint (optional)
  label?: string; // tooltip / a11y
}

@Component({
  selector: 'app-vowel-chart',
  standalone: true,
  templateUrl: './vowel-chart.component.html',
  styleUrls: ['./vowel-chart.component.scss'],
  imports: [NgForOf, NgClass],
})
export class VowelChartComponent {
  @Input() nowPlaying: VowelKey | null = null;
  @Input() points: VowelPoint[] = IPA_POINTS;
  @Input() selected = new Set<VowelKey>();
  @Output() listen = new EventEmitter<VowelKey>(); // bubble to parent for audio
  @Output() selectedChange = new EventEmitter<Set<VowelKey>>();

  constructor(private cdr: ChangeDetectorRef) {}

  isSelected = (k: VowelKey) => this.selected.has(k);

  toggle(k: VowelKey) {
    const next = new Set(this.selected);
    next.has(k) ? next.delete(k) : next.add(k);
    this.selected = next;
    this.selectedChange.emit(next);
  }
}

/** Positions tuned to resemble the IPA chart. */
export const IPA_POINTS: VowelPoint[] = [
  // Close
  { id: 'i', symbol: 'i', x: 20, y: 10 },
  { id: 'y', symbol: 'y', x: 29, y: 10, rounded: true },
  { id: 'ibar', symbol: 'ɨ', x: 50, y: 10 },
  { id: 'ubar', symbol: 'ʉ', x: 59, y: 10, rounded: true },
  { id: 'vowelw', symbol: 'ɯ', x: 78, y: 10 },
  { id: 'u', symbol: 'u', x: 87, y: 10, rounded: true },

  // Near-close
  { id: 'ii', symbol: 'ɪ', x: 23, y: 23 },
  { id: 'upperY', symbol: 'ʏ', x: 31, y: 23, rounded: true },
  { id: 'nearu', symbol: 'ʊ', x: 87, y: 23, rounded: true },

  // Close-mid
  { id: 'e', symbol: 'e', x: 26, y: 36 },
  { id: 'oslant', symbol: 'ø', x: 35, y: 36, rounded: true },
  { id: 'backelow', symbol: 'ɘ', x: 51, y: 36 },
  { id: 'obar', symbol: 'ɵ', x: 60, y: 36, rounded: true },
  { id: 'voweltwist', symbol: 'ɤ', x: 78, y: 36 },
  { id: 'o', symbol: 'o', x: 87, y: 36, rounded: true },

  // Mid / schwa
  { id: 'ee', symbol: 'ə', x: 55, y: 45 },
  { id: 'er', symbol: 'ɝ', x: 55, y: 52 }, // Rhotic mid-central vowel

  // Open-mid
  { id: 'eh', symbol: 'ɛ', x: 30, y: 62 },
  { id: 'oe', symbol: 'œ', x: 39, y: 62, rounded: true },
  { id: 'backE', symbol: 'ɜ', x: 51, y: 62 },
  { id: 'roundb', symbol: 'ɞ', x: 60, y: 62, rounded: true },
  { id: 'uu', symbol: 'ʌ', x: 78, y: 62 },
  { id: 'backc', symbol: 'ɔ', x: 87, y: 62, rounded: true },

  // Near-open
  { id: 'ae', symbol: 'æ', x: 34, y: 75 },

  // Open
  { id: 'ah', symbol: 'a', x: 37, y: 88 },
  { id: 'ce', symbol: 'ɶ', x: 46, y: 88, rounded: true },
  { id: 'downa', symbol: 'ɐ', x: 55, y: 75 },
  { id: 'a', symbol: 'ɑ', x: 78, y: 88 },
  { id: 'backa', symbol: 'ɒ', x: 87, y: 88, rounded: true },
];
