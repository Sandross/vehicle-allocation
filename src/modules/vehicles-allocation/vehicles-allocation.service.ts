import { AllocateVehicleDto } from './dto/allocate-vehicle-dto';
import { Injectable, Logger } from '@nestjs/common';
import { VehiclesAllocationEntity } from 'src/entities/vehicle-allocation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VehiclesEntity } from 'src/entities/vehicle.entity';
import { DriverEntity } from 'src/entities/driver.entity';
import {
  checkDriverExists,
  checkIsVehicleAllocated,
  checkVehicleExists,
} from './utils';

@Injectable()
export class VehiclesAllocationService {
  private readonly logger = new Logger(VehiclesAllocationService.name);

  constructor(
    @InjectRepository(VehiclesAllocationEntity)
    private readonly vehiclesAllocationRepository: Repository<VehiclesAllocationEntity>,
    @InjectRepository(VehiclesEntity)
    private readonly vehiclesRepository: Repository<VehiclesEntity>,
    @InjectRepository(DriverEntity)
    private readonly driversRepository: Repository<DriverEntity>,
  ) {}

  async allocateVehicle(
    pendingAlocateVehicleValues: AllocateVehicleDto,
  ): Promise<VehiclesAllocationEntity> {
    try {
      const { vehicleId, driverId, reason } = pendingAlocateVehicleValues;
      await checkVehicleExists(+vehicleId, this.vehiclesRepository);
      await checkDriverExists(+driverId, this.driversRepository);
      await checkIsVehicleAllocated(
        +vehicleId,
        this.vehiclesAllocationRepository,
      );
      const vehicleAllocation = this.vehiclesAllocationRepository.create({
        vehicle: { id: +vehicleId },
        driver: { id: +driverId },
        reason,
      });
      return this.vehiclesAllocationRepository.save(vehicleAllocation);
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
