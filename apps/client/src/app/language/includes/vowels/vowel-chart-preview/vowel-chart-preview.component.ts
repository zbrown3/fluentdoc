import { Component, Input, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-vowel-chart-preview',
  standalone: true,
  templateUrl: './vowel-chart-preview.component.html',
  styleUrls: ['./vowel-chart-preview.component.scss'],
  imports: [NgForOf],
})
export class VowelChartPreviewComponent implements OnInit {
  ipaVowelsByType: Record<string, Record<string, unknown>[][]> = {};
  ipaVowelTypes: string[] = [];
  selectedVowels: string[] = [];
  vowelChartLabels: Record<string, unknown>[][] = [
    [
      { label: 'Front', x: 90, y: 15 },
      { label: 'Central', x: 320, y: 15 },
      { label: 'Back', x: 530, y: 15 },
    ],
    [
      { label: 'Close', x: 0, y: 50 },
      { label: 'Near-close', x: 0, y: 100 },
      { label: 'Close-mid', x: 0, y: 150 },
      { label: 'Mid', x: 0, y: 200 },
      { label: 'Open-mid', x: 0, y: 250 },
      { label: 'Near-open', x: 0, y: 300 },
      { label: 'Open', x: 0, y: 350 },
    ],
  ];

  @Input() vowelsData?: Record<string, unknown> | null = null;

  constructor() {}

  ngOnInit(): void {
    this.ipaVowelsByType = {
      close: [
        [
          { id: 'i', isDivider: false, symbol: 'i', x: 90, y: 50 },
          { isDivider: true, x: 107, y: 45 },
          {
            id: 'y',
            isDivider: false,
            symbol: 'y',
            x: 120,
            y: 50,
            rounded: true,
          },
          // Line between columns (front / central)
          { isLine: true, x1: 134, y1: 45, x2: 317, y2: 45 },
          // line between rows (close / near-close)
          { isLine: true, x1: 114, y1: 60, x2: 121, y2: 80 },
        ],
        [
          { id: 'ibar', isDivider: false, symbol: 'ɨ', x: 330, y: 50 },
          { isDivider: true, x: 348, y: 45 },
          {
            id: 'ubar',
            isDivider: false,
            symbol: 'ʉ',
            x: 360,
            y: 50,
            rounded: true,
          },
          // Line between columns (central / back)
          { isLine: true, x1: 376, y1: 45, x2: 510, y2: 45 },
          // line between rows (close / close-mid)
          { isLine: true, x1: 348, y1: 60, x2: 348, y2: 130 },
        ],
        [
          { id: 'vowelw', isDivider: false, symbol: 'ɯ', x: 520, y: 50 },
          { isDivider: true, x: 545, y: 45 },
          {
            id: 'u',
            isDivider: false,
            symbol: 'u',
            x: 558,
            y: 50,
            rounded: true,
          },
          // line between rows (close / close-mid)
          { isLine: true, x1: 545, y1: 60, x2: 545, y2: 80 },
        ],
      ],
      nearClose: [
        [
          { id: 'ii', isDivider: false, symbol: 'ɪ', x: 106, y: 100 },
          { isDivider: true, x: 124.5, y: 95 },
          {
            id: 'upperY',
            isDivider: false,
            symbol: 'ʏ',
            x: 136,
            y: 100,
            rounded: true,
          },
          // line between rows (near-close / close-mid)
          { isLine: true, x1: 131, y1: 110, x2: 139, y2: 130 },
        ],
        [
          {
            id: 'nearu',
            isDivider: false,
            symbol: 'ʊ',
            x: 541,
            y: 100,
            rounded: true,
          },
          // line between rows (close/close-mid)
          { isLine: true, x1: 545, y1: 110, x2: 545, y2: 130 },
        ],
      ],
      closeMid: [
        [
          { id: 'e', isDivider: false, symbol: 'e', x: 124.5, y: 150 },
          { isDivider: true, x: 143.5, y: 145 },
          {
            id: 'oslant',
            isDivider: false,
            symbol: 'ø',
            x: 154.5,
            y: 150,
            rounded: true,
          },
          // line between rows (close-mid / open-mid)
          { isLine: true, x1: 149, y1: 160, x2: 175, y2: 230 },
        ],
        [
          { id: 'backelow', isDivider: false, symbol: 'ɘ', x: 330, y: 150 },
          { isDivider: true, x: 350, y: 145 },
          {
            id: 'obar',
            isDivider: false,
            symbol: 'ɵ',
            x: 360,
            y: 150,
            rounded: true,
          },
          // line between rows (close-mid/mid)
          { isLine: true, x1: 350, y1: 160, x2: 350, y2: 180 },
        ],
        [
          { id: 'voweltwist', isDivider: false, symbol: 'ɤ', x: 523, y: 150 },
          { isDivider: true, x: 545, y: 145 },
          {
            id: 'o',
            isDivider: false,
            symbol: 'o',
            x: 558,
            y: 150,
            rounded: true,
          },
          // line between rows (close-mid / open-mid)
          { isLine: true, x1: 545, y1: 160, x2: 545, y2: 230 },
        ],
      ],
      mid: [
        [
          { id: 'ee', isDivider: false, symbol: 'ə', x: 346, y: 200 },
          { id: 'er', isDivider: false, symbol: 'ɝ', x: 346, y: 225 }, // Rhotic mid-central vowel
        ],
      ],
      openMid: [
        [
          { id: 'eh', isDivider: false, symbol: 'ɛ', x: 161, y: 250 },
          { isDivider: true, x: 180, y: 245 },
          {
            id: 'oe',
            isDivider: false,
            symbol: 'œ',
            x: 191,
            y: 250,
            rounded: true,
          },
          // line between rows (open-mid / near-open)
          { isLine: true, x1: 186, y1: 260, x2: 193, y2: 280 },
        ],
        [
          { id: 'backE', isDivider: false, symbol: 'ɜ', x: 330, y: 250 },
          { isDivider: true, x: 350, y: 245 },
          {
            id: 'roundb',
            isDivider: false,
            symbol: 'ɞ',
            x: 360,
            y: 250,
            rounded: true,
          },
          // line between rows (open-mid/near-open)
          { isLine: true, x1: 350, y1: 260, x2: 350, y2: 280 },
        ],
        [
          { id: 'uu', isDivider: false, symbol: 'ʌ', x: 523, y: 250 },
          { isDivider: true, x: 545, y: 245 },
          {
            id: 'backc',
            isDivider: false,
            symbol: 'ɔ',
            x: 558,
            y: 250,
            rounded: true,
          },
          // line between rows (open-mid / open)
          { isLine: true, x1: 545, y1: 260, x2: 545, y2: 330 },
        ],
      ],
      nearOpen: [
        [
          { id: 'ae', isDivider: false, symbol: 'æ', x: 192, y: 300 },
          // line between rows (near-open / open)
          { isLine: true, x1: 204, y1: 310, x2: 211, y2: 330 },
        ],
        [
          { id: 'downa', isDivider: false, symbol: 'ɐ', x: 346, y: 300 },
          // line between rows (near-open / open)
          { isLine: true, x1: 350, y1: 310, x2: 350, y2: 345 },
        ],
      ],
      open: [
        [
          { id: 'ah', isDivider: false, symbol: 'a', x: 195, y: 350 },
          { isDivider: true, x: 215, y: 345 },
          {
            id: 'ce',
            isDivider: false,
            symbol: 'ɶ',
            x: 225,
            y: 350,
            rounded: true,
          },
          // Line between columns (central/back)
          { isLine: true, x1: 250, y1: 345, x2: 510, y2: 345 },
        ],
        [
          { id: 'a', isDivider: false, symbol: 'ɑ', x: 523, y: 350 },
          { isDivider: true, x: 545, y: 345 },
          {
            id: 'backa',
            isDivider: false,
            symbol: 'ɒ',
            x: 558,
            y: 350,
            rounded: true,
          },
        ],
      ],
    };

    this.ipaVowelTypes = Object.keys(this.ipaVowelsByType);

    if (this.vowelsData) {
      const selectedVowels = Object.keys(this.vowelsData).filter(
        (key) => this.vowelsData?.[key] === true
      );

      this.selectedVowels = selectedVowels;
    }
  }

  getIsSelected(vowelId: unknown): boolean {
    return this.selectedVowels.includes(vowelId as string);
  }
}
