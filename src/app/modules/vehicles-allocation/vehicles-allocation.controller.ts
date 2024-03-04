import { Body, Controller, Post } from '@nestjs/common';
import { VehiclesAllocationService } from './vehicles-allocation.service';
import { AllocateVehicleDto } from './dto/allocate-vehicle-dto';

@Controller('vehicles-allocation')
export class VehiclesAllocationController {
  constructor(
    private readonly vehiclesAllocationService: VehiclesAllocationService,
  ) {}

  @Post()
  allocateVehicle(@Body() allocateVehicleDto: AllocateVehicleDto) {
    return this.vehiclesAllocationService.allocateVehicle(allocateVehicleDto);
  }
}
