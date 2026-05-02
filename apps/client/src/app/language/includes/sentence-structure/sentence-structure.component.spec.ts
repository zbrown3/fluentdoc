import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceStructureComponent } from './sentence-structure.component';

describe('SentenceStructureComponent', () => {
  let component: SentenceStructureComponent;
  let fixture: ComponentFixture<SentenceStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentenceStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentenceStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
