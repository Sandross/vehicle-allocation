import {
  mockedDriversService,
  mockedVehicleAllocationService,
} from '../test-utils';
import { Test, TestingModule } from '@nestjs/testing';
import { DriverService } from '../../src/modules/drivers/drivers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DriverEntity } from '../../src/modules/drivers/driver.entity';
import { VehiclesAllocationEntity } from '../../src/modules/vehicles-allocation/vehicle-allocation.entity';
describe('Drivers service', () => {
  let service: DriverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        DriverService,
        {
          provide: getRepositoryToken(DriverEntity),
          useValue: mockedDriversService,
        },
        {
          provide: getRepositoryToken(VehiclesAllocationEntity),
          useValue: mockedVehicleAllocationService,
        },
      ],
    }).compile();
    service = module.get<DriverService>(DriverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new driver', async () => {
    const requestInput = {
      name: 'Sandro',
    };
    const requestResult = {
      id: 1,
      name: 'Sandro',
    };
    mockedDriversService.findOne.mockResolvedValueOnce(null);
    mockedDriversService.save.mockResolvedValueOnce(requestResult);
    const sut = await service.createNewDriver(requestInput);
    expect(sut).toEqual(requestResult);
  });
  it('should throw error if driver already exists', async () => {
    const requestInput = {
      name: 'Sandro',
    };
    mockedDriversService.findOne.mockResolvedValueOnce(requestInput);
    try {
      await service.createNewDriver(requestInput);
    } catch (error) {
      expect(error.message).toBe('Driver with name Sandro already exists');
    }
  });
});
