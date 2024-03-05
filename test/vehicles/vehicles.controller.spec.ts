import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from '../../src/modules/vehicles/vehicles.controller';
import { VehiclesService } from '../../src/modules/vehicles/vehicles.service';
import VehiclesRepository from '../../src/modules/vehicles/vehicles.repository';

const mockedVehiclesService = {
  createNewVehicle: jest.fn(),
  updateVehicle: jest.fn(),
  deleteVehicle: jest.fn(),
  getVehicleById: jest.fn(),
  getVehicles: jest.fn(),
};

const mockedVehiclesRepository = {
  getVehiclesByFilters: jest.fn(),
};

describe('Vehicles Controller', () => {
  let controller: VehiclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: mockedVehiclesService,
        },
        {
          provide: VehiclesRepository,
          useValue: mockedVehiclesRepository,
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new vehicle', async () => {
    const createVehicleDto = {
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };

    await controller.createNewVehicle(createVehicleDto);

    expect(mockedVehiclesService.createNewVehicle).toHaveBeenCalledWith(
      createVehicleDto,
    );
  });
  it('should update a vehicle', async () => {
    const updateVehicleDto = {
      license_plate: 'ABC123',
      color: 'Blue',
      brand: 'Toyota',
    };

    const vehicleId = '1';

    await controller.updateVehicle(updateVehicleDto, vehicleId);

    expect(mockedVehiclesService.updateVehicle).toHaveBeenCalledWith(
      +vehicleId,
      updateVehicleDto,
    );
  });

  it('should delete a vehicle', async () => {
    const vehicleId = '1';

    await controller.deleteVehicle(vehicleId);

    expect(mockedVehiclesService.deleteVehicle).toHaveBeenCalledWith(
      +vehicleId,
    );
  });
  it('should get a vehicle by id', async () => {
    const vehicleId = '1';

    await controller.getVehicleById(vehicleId);

    expect(mockedVehiclesService.getVehicleById).toHaveBeenCalledWith(
      +vehicleId,
    );
  });
  it('should get vehicles by filters', async () => {
    const vehiclesFilters = {
      color: 'Blue',
    };

    await controller.getVehicles(vehiclesFilters);

    expect(mockedVehiclesRepository.getVehiclesByFilters).toHaveBeenCalledWith(
      vehiclesFilters,
    );
  });
});
