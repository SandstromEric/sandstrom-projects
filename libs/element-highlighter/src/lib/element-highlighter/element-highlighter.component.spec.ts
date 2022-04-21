import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementHighlighterComponent } from './element-highlighter.component';

describe('ElementHighlighterComponent', () => {
  let component: ElementHighlighterComponent;
  let fixture: ComponentFixture<ElementHighlighterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElementHighlighterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
