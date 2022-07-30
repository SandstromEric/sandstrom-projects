import { TestBed } from '@angular/core/testing';

import { TalentTreeService } from './talent-tree.service';

describe('TalentTreeService', () => {
  let service: TalentTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalentTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
