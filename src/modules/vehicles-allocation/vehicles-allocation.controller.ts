import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VehiclesAllocationService } from './vehicles-allocation.service';
import { AllocateVehicleDto } from './dto/allocate-vehicle-dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('vehicles-allocation')
@Controller('vehicles-allocation')
export class VehiclesAllocationController {
  constructor(
    private readonly vehiclesAllocationService: VehiclesAllocationService,
  ) {}

  @Post()
  allocateVehicle(@Body() allocateVehicleDto: AllocateVehicleDto) {
    return this.vehiclesAllocationService.allocateVehicle(allocateVehicleDto);
  }

  @Get()
  getAllAllocatedVehicles() {
    return this.vehiclesAllocationService.getAllAllocatedVehicles();
  }

  @Post('/finish')
  finishVehiclesAllocateContract(@Query('contractId') contractId: string) {
    return this.vehiclesAllocationService.finishVehiclesAllocateContract(
      +contractId,
    );
  }
}
