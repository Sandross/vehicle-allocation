import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesAllocationController } from '../../src/modules/vehicles-allocation/vehicles-allocation.controller';
import { VehiclesAllocationService } from '../../src/modules/vehicles-allocation/vehicles-allocation.service';

const mockedVehiclesAllocationService = {
  allocateVehicle: jest.fn(),
  getAllAllocatedVehicles: jest.fn(),
  finishVehiclesAllocateContract: jest.fn(),
};

describe('VehiclesAllocation Controller', () => {
  let controller: VehiclesAllocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesAllocationController],
      providers: [
        {
          provide: VehiclesAllocationService,
          useValue: mockedVehiclesAllocationService,
        },
      ],
    }).compile();

    controller = module.get<VehiclesAllocationController>(
      VehiclesAllocationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should allocate a vehicle', async () => {
    const allocateVehicleDto = {
      vehicleId: '1',
      driverId: '1',
      reason: 'test',
    };

    await controller.allocateVehicle(allocateVehicleDto);

    expect(
      mockedVehiclesAllocationService.allocateVehicle,
    ).toHaveBeenCalledWith(allocateVehicleDto);
  });
  it('should finish a vehicle allocation contract', async () => {
    await controller.finishVehiclesAllocateContract('1');
    expect(
      mockedVehiclesAllocationService.finishVehiclesAllocateContract,
    ).toHaveBeenCalledWith(1);
  });
  it('should get all allocated vehicles', async () => {
    await controller.getAllAllocatedVehicles();
    expect(
      mockedVehiclesAllocationService.getAllAllocatedVehicles,
    ).toHaveBeenCalled();
  });
});
