import { Module } from '@nestjs/common';
import { VehiclesAllocationController } from './vehicles-allocation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesAllocationEntity } from 'src/app/entities/vehicle-allocation.entity';
import { DriverEntity } from 'src/app/entities/driver.entity';
import { VehiclesEntity } from 'src/app/entities/vehicle.entity';
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