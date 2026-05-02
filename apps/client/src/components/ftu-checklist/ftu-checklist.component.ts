import {Component, Input} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

export interface Step {
  title: string;
  description: string;
  status: 'done' | 'current' | 'upcoming';
}

@Component({
  selector: 'app-ftu-checklist',
  standalone: true,
  providers: [],
  templateUrl: './ftu-checklist.component.html',
  styleUrls: ['./ftu-checklist.component.scss'],
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgForOf,
    NgSwitchDefault,
    NgClass
  ]
})
export class FtuChecklistComponent {

  @Input() steps: Step[] = [];

  constructor() {}

  isExpanded = false;

  toggleSteps() {
    this.isExpanded = !this.isExpanded;
  }

  get progress(): number {
    const done = this.steps?.filter(s => s.status === 'done').length;
    return Math.round((done / this.steps.length) * 100);
  }

  // Add any methods or properties needed for the component here
  // For example, you might want to track checklist items or handle user interactions
}
