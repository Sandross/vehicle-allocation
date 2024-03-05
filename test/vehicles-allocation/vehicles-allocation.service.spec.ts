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
import * as checks from '../../src/modules/vehicles-allocation/utils';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('../../src/modules/vehicles-allocation/utils', () => ({
  checkVehicleExists: jest.fn(),
  checkDriverExists: jest.fn(),
  checkIsVehicleAllocated: jest.fn(),
  driverHasAlreadyActiveContract: jest.fn(),
}));
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
    // Mockando as funções de verificação
    jest.spyOn(checks, 'checkVehicleExists').mockResolvedValueOnce();
    jest.spyOn(checks, 'checkDriverExists').mockResolvedValueOnce();
    jest.spyOn(checks, 'checkIsVehicleAllocated').mockResolvedValueOnce();
    jest
      .spyOn(checks, 'driverHasAlreadyActiveContract')
      .mockResolvedValueOnce();

    // Mockando o retorno para o primeiro findOne
    mockedVehiclesService.findOne.mockResolvedValueOnce({});
    mockedDriversService.findOne.mockResolvedValueOnce({});

    // Mockando o retorno para o segundo findOne
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

    const result = await service.allocateVehicle(allocateVehicleSut);

    expect(result).toEqual(expect.objectContaining(vehicleAllocation));
  });
  it('should throw error if allocateVehicle throws', async () => {
    jest.spyOn(checks, 'checkVehicleExists').mockRejectedValueOnce({});
    try {
      await service.allocateVehicle({
        vehicleId: '1',
        driverId: '1',
        reason: 'test',
      });
    } catch (error) {
      expect(error.message).toEqual('Http Exception');
    }
  });
  it('should throw if  finishVehiclesAllocateContract throws', async () => {
    mockedVehicleAllocationService.findOne.mockRejectedValueOnce(
      new Error('Vehicle allocation contract not found or its already done'),
    );
    const contractId = 1;
    try {
      await service.finishVehiclesAllocateContract(contractId);
    } catch (error) {
      expect(error.message).toBe(
        'Vehicle allocation contract not found or its already done',
      );
    }
  });

  it('should throw if finishVehiclesAllocateContract get an error', async () => {
    mockedVehicleAllocationService.findOne.mockRejectedValueOnce(
      new Error('Vehicle allocation contract not found or its already done'),
    );
    const contractId = 1;
    try {
      await service.finishVehiclesAllocateContract(contractId);
    } catch (error) {
      expect(error.message).toBe(
        'Vehicle allocation contract not found or its already done',
      );
    }
  });
  it('should throw if finishVehiclesAllocateContract throws', async () => {
    // Mockando a chamada para findOne lançar um erro, simulando um erro interno
    mockedVehicleAllocationService.findOne.mockImplementation(() => {
      throw new Error(
        'Vehicle allocation contract not found or its already done',
      );
    });

    const contractId = 1;
    try {
      await service.finishVehiclesAllocateContract(contractId);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe(
        'Vehicle allocation contract not found or its already done',
      );
      expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });
  it('should throw if getAllAllocatedVehicles throws', async () => {
    mockedVehicleAllocationService.find.mockRejectedValueOnce(
      new Error('Internal'),
    );
    try {
      await service.getAllAllocatedVehicles();
    } catch (error) {
      expect(error.message).toBe('Internal');
    }
  });
});
