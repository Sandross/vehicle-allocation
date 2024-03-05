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

  it('should update a driver', async () => {
    const requestInput = {
      id: 1,
      name: 'Sandro',
    };
    mockedDriversService.findOne.mockResolvedValueOnce(requestInput);
    mockedDriversService.update.mockResolvedValueOnce(requestInput);
    mockedDriversService.findOne.mockResolvedValueOnce(requestInput);
    const sut = await service.updateDriver(1, requestInput);
    expect(sut).toEqual(requestInput);
  });

  it('should throw error if driver not found', async () => {
    const requestInput = {
      id: 1,
      name: 'Sandro',
    };
    mockedDriversService.findOne.mockResolvedValueOnce(null);
    try {
      await service.updateDriver(1, requestInput);
    } catch (error) {
      expect(error.message).toBe(`Driver with id ${requestInput.id} not found`);
    }
  });

  it('should delete a driver', async () => {
    const requestInput = {
      id: 1,
      name: 'Sandro',
    };
    mockedDriversService.findOne.mockResolvedValueOnce(requestInput);
    mockedDriversService.softDelete.mockResolvedValueOnce(requestInput);
    const sut = await service.deleteDriver(1);
    expect(sut).toEqual(
      `Driver with id ${requestInput.id} deleted successfully`,
    );
  });

  it('should throw error if driver not found', async () => {
    const requestInput = {
      id: 1,
      name: 'Sandro',
    };
    mockedDriversService.findOne.mockResolvedValueOnce(null);
    try {
      await service.deleteDriver(1);
    } catch (error) {
      expect(error.message).toBe(`Driver with id ${requestInput.id} not found`);
    }
  });
  it('should throw error if driver is under contract', async () => {
    const requestInput = {
      id: 1,
      name: 'Sandro',
    };
    mockedDriversService.findOne.mockResolvedValueOnce(requestInput);
    mockedVehicleAllocationService.findOne.mockResolvedValueOnce({
      id: 1,
      driver: requestInput,
      endDate: null,
    });
    try {
      await service.deleteDriver(1);
    } catch (error) {
      expect(error.message).toBe(
        `Driver with id ${requestInput.id} is currently under contract, cannot delete it`,
      );
    }
  });
  it('should get all drivers', async () => {
    const requestResult = [
      {
        id: 1,
        name: 'Sandro',
        usageRecords: [],
      },
    ];
    mockedDriversService.find.mockResolvedValueOnce(requestResult);
    const sut = await service.findAllDrivers();
    expect(sut).toEqual(requestResult);
  });
  it('should throw error if name is invalid in findAllDrivers', async () => {
    const requestInput = 'Sandro';
    mockedDriversService.find.mockResolvedValueOnce(null);
    try {
      await service.findAllDrivers(requestInput);
    } catch (error) {
      expect(error.message).toBe(`No driver with name ${requestInput} found`);
    }
  });
  it('should throw error if there are no drivers in the database, without name filter', async () => {
    mockedDriversService.find.mockResolvedValueOnce(null);
    try {
      await service.findAllDrivers();
    } catch (error) {
      expect(error.message).toBe('We have no drivers in the database');
    }
  });
  it('should find driver by id', async () => {
    const requestResult = {
      id: 1,
      name: 'Sandro',
      usageRecords: [],
    };
    mockedDriversService.findOne.mockResolvedValueOnce(requestResult);
    const sut = await service.findDriverById(1);
    expect(sut).toEqual(requestResult);
  });
  it('should throw error if driver not found in findDriverById', async () => {
    const requestInput = 1;
    mockedDriversService.findOne.mockResolvedValueOnce(null);
    try {
      await service.findDriverById(requestInput);
    } catch (error) {
      expect(error.message).toBe(`Driver with id ${requestInput} not found`);
    }
  });
  it('should throw if updateDriver throws', async () => {
    const requestInput = {
      id: 1,
      name: 'Sandro',
    };
    mockedDriversService.findOne.mockRejectedValueOnce(new Error('Error'));
    try {
      await service.updateDriver(1, requestInput);
    } catch (error) {
      expect(error.message).toBe('Error');
    }
  });
  it('should throw if deleteDriver throws', async () => {
    const requestInput = 1;
    mockedDriversService.findOne.mockRejectedValueOnce(new Error('Error'));
    try {
      await service.deleteDriver(requestInput);
    } catch (error) {
      expect(error.message).toBe('Error');
    }
  });
  it('should throw if findAllDrivers throws', async () => {
    mockedDriversService.find.mockRejectedValueOnce(new Error('Error'));
    try {
      await service.findAllDrivers();
    } catch (error) {
      expect(error.message).toBe('Error');
    }
  });
  it('should throw if findDriverById throws', async () => {
    const requestInput = 1;
    mockedDriversService.findOne.mockRejectedValueOnce(new Error('Error'));
    try {
      await service.findDriverById(requestInput);
    } catch (error) {
      expect(error.message).toBe('Error');
    }
  });
  it('should throw if createNewDriver throws', async () => {
    const requestInput = {
      name: 'Sandro',
    };
    mockedDriversService.findOne.mockRejectedValueOnce(new Error('Error'));
    try {
      await service.createNewDriver(requestInput);
    } catch (error) {
      expect(error.message).toBe('Error');
    }
  });
});
