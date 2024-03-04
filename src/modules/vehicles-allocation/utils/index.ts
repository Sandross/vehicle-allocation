import { DriverEntity } from 'src/entities/driver.entity';
import { VehiclesAllocationEntity } from 'src/entities/vehicle-allocation.entity';
import { VehiclesEntity } from 'src/entities/vehicle.entity';
import { Repository } from 'typeorm';

async function checkVehicleExists(
  vehicleId: number,
  vehiclesRepository: Repository<VehiclesEntity>,
): Promise<void> {
  const vehicle = await vehiclesRepository.findOne({
    where: { id: vehicleId },
  });
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
}

async function checkDriverExists(
  driverId: number,
  driversRepository: Repository<DriverEntity>,
): Promise<void> {
  const driver = await driversRepository.findOne({ where: { id: driverId } });
  if (!driver) {
    throw new Error('Driver not found');
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
  console.log(vehicle);
  if (vehicle) {
    throw new Error('Vehicle already allocated');
  }
}

export { checkVehicleExists, checkDriverExists, checkIsVehicleAllocated };
