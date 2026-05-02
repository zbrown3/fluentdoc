import {AfterViewInit, Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import confetti from 'canvas-confetti';
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-achievement-modal',
  standalone: true,
  templateUrl: './achievement-modal.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./achievement-modal.component.scss']
})
export class AchievementModalComponent implements AfterViewInit {
  @Input() icon: string = '🎉';
  @Input() title: string = 'Achievement Unlocked!';
  @Input() description: string = '';
  @Input() ctaLabel: string = '';
  @Input() ctaLink: string = '';
  @Input() dismissLabel: string = 'Close';

  constructor(private bsModalRef: BsModalRef) {}

  closeModal() {
    this.bsModalRef.hide();
  }

  ngAfterViewInit(): void {
    this.launchConfetti();
  }

  private launchConfetti(): void {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4A6CF7', '#A855F7', '#22C55E', '#FACC15']
    });
  }
}
