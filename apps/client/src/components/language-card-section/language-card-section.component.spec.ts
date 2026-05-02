import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageCardSectionComponent } from './language-card-section.component';

describe('LanguageCardSectionComponent', () => {
  let component: LanguageCardSectionComponent;
  let fixture: ComponentFixture<LanguageCardSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageCardSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LanguageCardSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
