import { Module } from '@nestjs/common';
import { VehiclesAllocationController } from './vehicles-allocation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesAllocationEntity } from '../../modules/vehicles-allocation/vehicle-allocation.entity';
import { DriverEntity } from '../../modules/drivers/driver.entity';
import { VehiclesEntity } from '../../modules/vehicles/vehicle.entity';
import { VehiclesAllocationService } from './vehicles-allocation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehiclesAllocationEntity,
      DriverEntity,
      VehiclesEntity,
    ]),
  ],
  controllers: [VehiclesAllocationController],
  providers: [VehiclesAllocationService],
})
export class VehiclesAllocationModule {}
