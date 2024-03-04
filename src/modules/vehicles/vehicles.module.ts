import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { VehiclesEntity } from 'src/modules/vehicles/vehicle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import VehiclesRepository from './vehicles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VehiclesEntity])],
  providers: [VehiclesService, VehiclesRepository],
  controllers: [VehiclesController],
})
export class VehiclesModule {}
