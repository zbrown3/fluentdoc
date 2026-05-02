import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingCreateFirstConlangComponent } from './create-first-conlang.component';

describe('CreateFirstConlangComponent', () => {
  let component: OnboardingCreateFirstConlangComponent;
  let fixture: ComponentFixture<OnboardingCreateFirstConlangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingCreateFirstConlangComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingCreateFirstConlangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
