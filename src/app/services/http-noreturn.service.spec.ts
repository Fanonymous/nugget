import { TestBed } from '@angular/core/testing';

import { HttpNoreturnService } from './http-noreturn.service';

describe('HttpNoreturnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpNoreturnService = TestBed.get(HttpNoreturnService);
    expect(service).toBeTruthy();
  });
});
