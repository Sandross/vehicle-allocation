import { mockedVehiclesRepository, mockedVehiclesService } from '../test-utils';
import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from '../../src/modules/vehicles/vehicles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehiclesEntity } from '../../src/modules/vehicles/vehicle.entity';
import { VehiclesAllocationEntity } from '../../src/modules/vehicles-allocation/vehicle-allocation.entity';

describe('Vehicles service', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(VehiclesEntity),
          useValue: mockedVehiclesService,
        },
        {
          provide: getRepositoryToken(VehiclesAllocationEntity),
          useValue: mockedVehiclesRepository,
        },
      ],
    }).compile();
    service = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new vehicle', async () => {
    const requestInput = {
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };
    const requestResult = {
      id: 1,
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };
    mockedVehiclesService.findOne.mockResolvedValueOnce(null);
    mockedVehiclesService.save.mockResolvedValueOnce(requestResult);
    const sut = await service.createNewVehicle(requestInput);
    expect(sut).toEqual(requestResult);
  });
  it('should throw error if vehicle already exists', async () => {
    const requestInput = {
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };
    mockedVehiclesService.findOne.mockResolvedValueOnce(requestInput);
    try {
      await service.createNewVehicle(requestInput);
    } catch (error) {
      expect(error.message).toBe('Vehicle with brand Toyota already exists');
    }
  });

  it('should update a vehicle', async () => {
    const requestInput = {
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };
    const requestResult = {
      id: 1,
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };
    mockedVehiclesService.findOne.mockResolvedValueOnce(requestInput);
    mockedVehiclesService.update.mockResolvedValueOnce(requestResult);
    mockedVehiclesService.findOne.mockResolvedValueOnce(requestResult);
    const sut = await service.updateVehicle(1, requestInput);
    expect(sut).toEqual(requestResult);
  });
  it('should throw error if vehicle does not exist', async () => {
    const requestInput = {
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };
    mockedVehiclesService.findOne.mockResolvedValueOnce(null);
    try {
      await service.updateVehicle(1, requestInput);
    } catch (error) {
      expect(error.message).toBe('Vehicle with id 1 not found');
    }
  });
  it('should delete a vehicle', async () => {
    const requestResult = {
      id: 1,
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };
    mockedVehiclesService.findOne.mockResolvedValueOnce(requestResult);
    mockedVehiclesRepository.findOne.mockResolvedValueOnce(null);
    mockedVehiclesService.softDelete.mockResolvedValueOnce(requestResult);
    const sut = await service.deleteVehicle(1);
    expect(sut).toBe(
      `Vehicle with id ${requestResult.id} deleted successfully`,
    );
  });
  it('should throw error if vehicle is current under contract', async () => {
    const requestResult = {
      id: 1,
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };
    mockedVehiclesService.findOne.mockResolvedValueOnce(requestResult);
    mockedVehiclesRepository.findOne.mockResolvedValueOnce(requestResult);
    try {
      await service.deleteVehicle(1);
    } catch (error) {
      expect(error.message).toBe(
        'Vehicle with id 1 is currently under contract',
      );
    }
  });
  it('should throw error if not find a vehicle to delete', async () => {
    mockedVehiclesService.findOne.mockResolvedValueOnce(null);
    try {
      await service.deleteVehicle(1);
    } catch (error) {
      expect(error.message).toBe('Vehicle with id 1 not found');
    }
  });
  it('should get vehicle by id', async () => {
    const requestResult = {
      id: 1,
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };
    mockedVehiclesService.findOne.mockResolvedValueOnce(requestResult);
    const sut = await service.getVehicleById(1);
    expect(sut).toEqual(requestResult);
  });
  it('should throw error if vehicle does not exist', async () => {
    mockedVehiclesService.findOne.mockResolvedValueOnce(null);
    try {
      await service.getVehicleById(1);
    } catch (error) {
      expect(error.message).toBe('Vehicle with id 1 not found');
    }
  });
  it('should throw if createNewVehicle throws', async () => {
    const requestInput = {
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };
    mockedVehiclesService.findOne.mockRejectedValueOnce(new Error('Internal'));
    try {
      await service.createNewVehicle(requestInput);
    } catch (error) {
      expect(error.message).toBe('Internal');
    }
  });
  it('should throw if updateVehicle throws', async () => {
    const requestInput = {
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };
    mockedVehiclesService.findOne.mockRejectedValueOnce(new Error('Internal'));
    try {
      await service.updateVehicle(1, requestInput);
    } catch (error) {
      expect(error.message).toBe('Internal');
    }
  });
  it('should throw if deleteVehicle throws', async () => {
    mockedVehiclesService.findOne.mockRejectedValueOnce(new Error('Internal'));
    try {
      await service.deleteVehicle(1);
    } catch (error) {
      expect(error.message).toBe('Internal');
    }
  });
  it('should throw if getVehicleById throws', async () => {
    mockedVehiclesService.findOne.mockRejectedValueOnce(new Error('Internal'));
    try {
      await service.getVehicleById(1);
    } catch (error) {
      expect(error.message).toBe('Internal');
    }
  });
});
