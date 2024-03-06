import { AllocateVehicleDto } from './dto/allocate-vehicle-dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { VehiclesAllocationEntity } from '../../modules/vehicles-allocation/vehicle-allocation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VehiclesEntity } from '../../modules/vehicles/vehicle.entity';
import { DriverEntity } from '../../modules/drivers/driver.entity';
import EntityChecker from '../../common/validation/vehicle-allocance';

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
      await EntityChecker.checkVehicleExists(
        +vehicleId,
        this.vehiclesRepository,
      );
      await EntityChecker.checkDriverExists(+driverId, this.driversRepository);
      await EntityChecker.checkIsVehicleAllocated(
        +vehicleId,
        this.vehiclesAllocationRepository,
      );

      await EntityChecker.driverHasAlreadyActiveContract(
        +driverId,
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
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAllAllocatedVehicles(): Promise<VehiclesAllocationEntity[]> {
    try {
      const request = this.vehiclesAllocationRepository.find({
        relations: ['driver', 'vehicle'],
      });
      if (!request) {
        throw new BadRequestException('No vehicle allocation found');
      }
      return request;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async finishVehiclesAllocateContract(
    contractId: number,
  ): Promise<VehiclesAllocationEntity> {
    try {
      const vehicleAllocation = await this.vehiclesAllocationRepository.findOne(
        { where: { id: contractId, endDate: null } },
      );
      if (!vehicleAllocation) {
        throw new BadRequestException(
          'Vehicle allocation contract not found or its already done',
        );
      }
      vehicleAllocation.endDate = new Date();
      return this.vehiclesAllocationRepository.save(vehicleAllocation);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
