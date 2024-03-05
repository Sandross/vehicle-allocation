import {
  mockedDriversService,
  mockedVehicleAllocationService,
  mockedVehiclesService,
} from '../test-utils';
import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesAllocationService } from '../../src/modules/vehicles-allocation/vehicles-allocation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehiclesAllocationEntity } from '../../src/modules/vehicles-allocation/vehicle-allocation.entity';
import { VehiclesEntity } from '../../src/modules/vehicles/vehicle.entity';
import { DriverEntity } from '../../src/modules/drivers/driver.entity';

describe('VehiclesAllocationService', () => {
  let service: VehiclesAllocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesAllocationService,
        {
          provide: getRepositoryToken(VehiclesAllocationEntity),
          useValue: mockedVehicleAllocationService,
        },
        {
          provide: getRepositoryToken(VehiclesEntity),
          useValue: mockedVehiclesService,
        },
        {
          provide: getRepositoryToken(DriverEntity),
          useValue: mockedDriversService,
        },
      ],
    }).compile();

    service = module.get<VehiclesAllocationService>(VehiclesAllocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should get all allocated vehicles', async () => {
    const allocatedVehicles = {
      vehicleId: 1,
      driverId: 1,
      reason: 'test',
    };
    mockedVehicleAllocationService.find.mockResolvedValueOnce(
      allocatedVehicles,
    );
    expect(await service.getAllAllocatedVehicles()).toEqual(allocatedVehicles);
  });
  it('should throw error if no allocated contract was found', async () => {
    mockedVehicleAllocationService.find.mockResolvedValueOnce(null);
    service.getAllAllocatedVehicles();
    await expect(service.getAllAllocatedVehicles()).rejects.toThrow(
      'No vehicle allocation found',
    );
  });
  it('finish vehicle allocation contract', async () => {
    const contractId = '1';
    const contract = {
      id: 1,
      vehicleId: 1,
      driverId: 1,
      reason: 'test',
    };
    mockedVehicleAllocationService.findOne.mockResolvedValueOnce(contract);
    mockedVehicleAllocationService.save.mockResolvedValueOnce(contract);
    expect(await service.finishVehiclesAllocateContract(+contractId)).toEqual(
      contract,
    );
  });
  it('should throw error if vehicle allocation contract is not found', async () => {
    try {
      const contractId = '1';
      mockedVehicleAllocationService.findOne.mockResolvedValueOnce(null);
      await service.finishVehiclesAllocateContract(+contractId);
    } catch (error) {
      expect(error.message).toEqual(
        'Vehicle allocation contract not found or its already done',
      );
    }
  });
  it('should allocate vehicle', async () => {
    mockedVehiclesService.findOne.mockResolvedValueOnce({});
    mockedDriversService.findOne.mockResolvedValueOnce({});
    mockedVehicleAllocationService.findOne.mockResolvedValueOnce(null);
    mockedVehicleAllocationService.findOne.mockResolvedValueOnce(null);

    const vehicleAllocation = {
      id: '999',
      vehicleId: '999',
      driverId: '999',
      reason: 'test',
    };

    mockedVehicleAllocationService.create.mockResolvedValueOnce(
      vehicleAllocation,
    );
    mockedVehicleAllocationService.save.mockResolvedValueOnce(
      vehicleAllocation,
    );

    const allocateVehicleSut = {
      vehicleId: '1',
      driverId: '1',
      reason: 'test',
    };

    await service.allocateVehicle(allocateVehicleSut);
    const result = await service.allocateVehicle(allocateVehicleSut);

    expect(result).toEqual(vehicleAllocation);
  });
  it('should throw if allocateVehicle throws', async () => {
    try {
      const allocateVehicleSut = {
        vehicleId: '1',
        driverId: '1',
        reason: 'test',
      };
      mockedVehiclesService.findOne.mockRejectedValueOnce(new Error('test'));
      await service.allocateVehicle(allocateVehicleSut);
    } catch (error) {
      expect(error.message).toEqual('test');
    }
  });
  it('should throw if getAllAllocatedVehicles throws', async () => {
    try {
      mockedVehicleAllocationService.find.mockRejectedValueOnce(
        new Error('test'),
      );
      await service.getAllAllocatedVehicles();
    } catch (error) {
      expect(error.message).toEqual('test');
    }
  });
  it('should throw if finishVehiclesAllocateContract throws', async () => {
    try {
      const contractId = '1';
      mockedVehicleAllocationService.findOne.mockRejectedValueOnce(
        new Error('test'),
      );
      await service.finishVehiclesAllocateContract(+contractId);
    } catch (error) {
      expect(error.message).toEqual('test');
    }
  });
});
