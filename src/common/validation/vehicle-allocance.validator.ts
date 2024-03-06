import { BadRequestException } from '@nestjs/common';
import { DriverEntity } from 'src/modules/drivers/driver.entity';
import { VehiclesAllocationEntity } from 'src/modules/vehicles-allocation/vehicle-allocation.entity';
import { VehiclesEntity } from 'src/modules/vehicles/vehicle.entity';
import { Repository } from 'typeorm';

class EntityChecker {
  private static async checkEntityExists<T>(
    entityId: number,
    repository: Repository<T> | any,
    errorMessage: string,
  ): Promise<void> {
    const entity = await repository.findOne({ where: { id: entityId } });
    if (!entity) {
      throw new BadRequestException(errorMessage);
    }
  }

  static async checkVehicleExists(
    vehicleId: number,
    vehiclesRepository: Repository<VehiclesEntity>,
  ): Promise<void> {
    await this.checkEntityExists(
      vehicleId,
      vehiclesRepository,
      'Http Exception',
    );
  }

  static async checkDriverExists(
    driverId: number,
    driversRepository: Repository<DriverEntity>,
  ): Promise<void> {
    await this.checkEntityExists(
      driverId,
      driversRepository,
      'Driver not found',
    );
  }

  static async checkIsVehicleAllocated(
    vehicleId: number,
    vehiclesAllocationRepository: Repository<VehiclesAllocationEntity>,
  ): Promise<void> {
    const vehicle = await vehiclesAllocationRepository.findOne({
      where: { id: vehicleId, endDate: null },
    });
    if (vehicle) {
      throw new BadRequestException('Vehicle already allocated');
    }
  }

  static async driverHasAlreadyActiveContract(
    driverId: number,
    vehiclesAllocationRepository: Repository<VehiclesAllocationEntity>,
  ): Promise<void> {
    const driver = await vehiclesAllocationRepository.findOne({
      where: { id: driverId, endDate: null },
    });
    if (driver) {
      throw new BadRequestException('Driver already has an active contract');
    }
  }
}

export default EntityChecker;
