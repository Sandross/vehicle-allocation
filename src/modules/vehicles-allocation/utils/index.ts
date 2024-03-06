import { BadRequestException } from '@nestjs/common';
import { DriverEntity } from '../../drivers/driver.entity';
import { VehiclesAllocationEntity } from '../vehicle-allocation.entity';
import { VehiclesEntity } from '../../vehicles/vehicle.entity';
import { Repository } from 'typeorm';

async function checkVehicleExists(
  vehicleId: number,
  vehiclesRepository: Repository<VehiclesEntity>,
): Promise<void> {
  const vehicle = await vehiclesRepository.findOne({
    where: { id: vehicleId },
  });
  if (!vehicle) {
    throw new BadRequestException('Vehicle not found');
  }
}

async function checkDriverExists(
  driverId: number,
  driversRepository: Repository<DriverEntity>,
): Promise<void> {
  const driver = await driversRepository.findOne({ where: { id: driverId } });
  if (!driver) {
    throw new BadRequestException('Driver not found');
  }
}

//Regras de negócio: Um automóvel só pode ser utilizado por um motorista por vez.
//Um motorista que já esteja utilizando um automóvel não pode utilizar outro automóvel ao mesmo tempo.
async function checkIsVehicleAllocated(
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

async function driverHasAlreadyActiveContract(
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

export {
  checkVehicleExists,
  checkDriverExists,
  checkIsVehicleAllocated,
  driverHasAlreadyActiveContract,
};
