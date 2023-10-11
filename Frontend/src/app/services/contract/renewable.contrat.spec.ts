import { TestBed } from '@angular/core/testing';

import { RenewableContractService } from './renewable.contract.service';

describe('ContractService', () => {
  let service: RenewableContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenewableContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
