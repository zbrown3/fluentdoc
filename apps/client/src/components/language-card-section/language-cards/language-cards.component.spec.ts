import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageCardsComponent } from './language-cards.component';

describe('LanguageCardsComponent', () => {
  let component: LanguageCardsComponent;
  let fixture: ComponentFixture<LanguageCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LanguageCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
