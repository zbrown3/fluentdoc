import { Component, Input } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import { Step } from '../ftu-checklist/ftu-checklist.component';

@Component({
  selector: 'app-ftu-checklist-fab',
  standalone: true,
  templateUrl: './ftu-checklist-fab.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./ftu-checklist-fab.component.scss']
})
export class FtuChecklistFabComponent {
  @Input() steps: Step[] = [];

  showPopup = false;

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  get completedSteps() {
    return this.steps.filter(step => step.status === 'done');
  }

  get currentStep() {
    return this.steps.find(step => step.status === 'current');
  }

  get progressPercentage() {
    if (this.steps.length === 0) return 0;
    const done = this.steps.filter(s => s.status === 'done').length;
    return Math.round((done / this.steps.length) * 100);
  }
}
