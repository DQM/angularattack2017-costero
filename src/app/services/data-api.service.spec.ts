import { TestBed, inject } from '@angular/core/testing';

import { DataApiService } from './data-api.service';

describe('DataApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataApiService]
    });
  });

  it('should ...', inject([DataApiService], (service: DataApiService) => {
    expect(service).toBeTruthy();
  }));
});
