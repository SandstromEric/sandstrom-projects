import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdleComponent } from './ordle.component';

describe('OrdleComponent', () => {
  let component: OrdleComponent;
  let fixture: ComponentFixture<OrdleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
