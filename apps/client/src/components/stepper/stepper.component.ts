import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export interface Step {
  viewId: string;
  onClick?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  [x: string]: unknown;
}

export interface StepEventResponse {
  newIndex: number;
  value: any;
  stepData?: any;
}

@Component({
  selector: 'app-fdds-stepper',
  standalone: true,
  imports: [NgClass],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
  constructor() {}

  @Input() classNames: string = '';
  @Input() label: string = '';
  @Input() steps: Step[] = [];
  @Input() showLabel: boolean = false;
  @Input() currentStep: number = 0;
  @Input() dataByStep: any;

  totalNumberOfSteps: number = this.steps.length;
}
