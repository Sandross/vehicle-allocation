import { Test, TestingModule } from '@nestjs/testing';
import { DriverController } from '../../src/modules/drivers/drivers.controller';
import { DriverService } from '../../src/modules/drivers/drivers.service';
import { mockedDriversService } from '../test-utils';

describe('Drivers Controller', () => {
  let controller: DriverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [
        {
          provide: DriverService,
          useValue: mockedDriversService,
        },
      ],
    }).compile();

    controller = module.get<DriverController>(DriverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new driver', async () => {
    const createDriverDto = {
      name: 'Sandro',
    };
    await controller.createNewDriver(createDriverDto);
    expect(mockedDriversService.createNewDriver).toHaveBeenCalledWith(
      createDriverDto,
    );
  });
  it('should update a driver', async () => {
    const updateDriverDto = {
      name: 'Sandro',
    };
    await controller.updateDriver('1', updateDriverDto);
    expect(mockedDriversService.updateDriver).toHaveBeenCalledWith(
      1,
      updateDriverDto,
    );
  });
  it('should delete a driver', async () => {
    await controller.deleteDriver('1');
    expect(mockedDriversService.deleteDriver).toHaveBeenCalledWith(1);
  });
  it('should find a driver by id', async () => {
    await controller.findDriverById('1');
    expect(mockedDriversService.findDriverById).toHaveBeenCalledWith(1);
  });
  it('should find all drivers', async () => {
    await controller.findAllDrivers('Sandro');
    expect(mockedDriversService.findAllDrivers).toHaveBeenCalledWith('Sandro');
  });
});
