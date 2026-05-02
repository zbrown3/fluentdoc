import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {OnboardingProfileComponent} from './onboarding-profile.component';

describe('ProfileComponent', () => {
  let component: OnboardingProfileComponent;
  let fixture: ComponentFixture<OnboardingProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingProfileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
