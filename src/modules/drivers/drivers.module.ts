import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from './driver.entity';
import { DriverService } from './drivers.service';
import { Module } from '@nestjs/common';
import { DriverController } from './drivers.controller';
import { VehiclesAllocationEntity } from '../vehicles-allocation/vehicle-allocation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity, VehiclesAllocationEntity])],
  providers: [DriverService],
  controllers: [DriverController],
})
export class DriverModule {}
