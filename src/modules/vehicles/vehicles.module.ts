import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { VehiclesEntity } from 'src/modules/vehicles/vehicle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import VehiclesRepository from './vehicles.repository';
import { VehiclesAllocationEntity } from '../vehicles-allocation/vehicle-allocation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VehiclesEntity, VehiclesAllocationEntity]),
  ],
  providers: [VehiclesService, VehiclesRepository],
  controllers: [VehiclesController],
})
export class VehiclesModule {}
