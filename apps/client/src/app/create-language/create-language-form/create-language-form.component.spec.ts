import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLanguageFormComponent } from './create-language-form.component';

describe('CreateLanguageFormComponent', () => {
  let component: CreateLanguageFormComponent;
  let fixture: ComponentFixture<CreateLanguageFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLanguageFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLanguageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
