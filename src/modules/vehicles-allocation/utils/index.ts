import { HttpException } from '@nestjs/common';
import { DriverEntity } from 'src/modules/drivers/driver.entity';
import { VehiclesAllocationEntity } from 'src/modules/vehicles-allocation/vehicle-allocation.entity';
import { VehiclesEntity } from 'src/modules/vehicles/vehicle.entity';
import { Repository } from 'typeorm';

async function checkVehicleExists(
  vehicleId: number,
  vehiclesRepository: Repository<VehiclesEntity>,
): Promise<void> {
  const vehicle = await vehiclesRepository.findOne({
    where: { id: vehicleId },
  });
  if (!vehicle) {
    throw new HttpException('Vehicle not found', 404);
  }
}

async function checkDriverExists(
  driverId: number,
  driversRepository: Repository<DriverEntity>,
): Promise<void> {
  const driver = await driversRepository.findOne({ where: { id: driverId } });
  if (!driver) {
    throw new HttpException('Driver not found', 404);
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
    throw new HttpException('Vehicle already allocated', 400);
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
    throw new HttpException('Driver already has an active contract', 400);
  }
}

export {
  checkVehicleExists,
  checkDriverExists,
  checkIsVehicleAllocated,
  driverHasAlreadyActiveContract,
};
