import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingQuestionaireComponent } from './questionaire.component';

describe('QuestionaireComponent', () => {
  let component: OnboardingQuestionaireComponent;
  let fixture: ComponentFixture<OnboardingQuestionaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingQuestionaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingQuestionaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
