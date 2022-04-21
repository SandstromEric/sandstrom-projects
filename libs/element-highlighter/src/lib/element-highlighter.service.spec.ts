import { TestBed } from '@angular/core/testing';

import { ElementHighlighterService } from './element-highlighter.service';

describe('ElementHighlighterService', () => {
  let service: ElementHighlighterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementHighlighterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
