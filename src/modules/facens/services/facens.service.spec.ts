import { Test, TestingModule } from '@nestjs/testing';
import { FacensService } from './facens.service';

describe('FacensService', () => {
  let service: FacensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacensService],
    }).compile();

    service = module.get<FacensService>(FacensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
