import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from '../../../src/modules/vehicles/vehicles.controller';
import { VehiclesService } from '../../../src/modules/vehicles/vehicles.service';

// Mock do serviço para isolar os testes
const mockVehiclesService = {
  createNewVehicle: jest.fn(),
  updateVehicle: jest.fn(),
  deleteVehicle: jest.fn(),
  getVehicleById: jest.fn(),
};

describe('VehiclesController', () => {
  let controller: VehiclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [{ provide: VehiclesService, useValue: mockVehiclesService }],
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

    expect(mockVehiclesService.createNewVehicle).toHaveBeenCalledWith(
      createVehicleDto,
    );
  });
});
