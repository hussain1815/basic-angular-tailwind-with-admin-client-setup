import { TestBed } from '@angular/core/testing';

import { CllinicProfileService } from './cllinic-profile.service';

describe('CllinicProfileService', () => {
  let service: CllinicProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CllinicProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
