import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateNewVehicleDto } from './dto/create-new-vehicle-dto';
import { UpdateVehicleDto } from './dto/update-vehicle-dto';
import { VehiclesFiltersDto } from './dto/vehicles-filters-dto';
import VehiclesRepository from './vehicles.repository';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly vehiclesRepository: VehiclesRepository,
  ) {}

  @Post()
  createNewVehicle(@Body() createVehicleDto: CreateNewVehicleDto) {
    return this.vehiclesService.createNewVehicle(createVehicleDto);
  }

  @Put('/:vehicleId')
  updateVehicle(
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.vehiclesService.updateVehicle(+vehicleId, updateVehicleDto);
  }

  @Delete('/:vehicleId')
  deleteVehicle(@Param('vehicleId') vehicleId: string) {
    return this.vehiclesService.deleteVehicle(+vehicleId);
  }

  @Get('/:vehicleId')
  getVehicleById(@Param('vehicleId') vehicleId: string) {
    return this.vehiclesService.getVehicleById(+vehicleId);
  }

  @Get()
  getVehicles(@Query() filters?: VehiclesFiltersDto) {
    return this.vehiclesRepository.getVehiclesByFilters(filters);
  }
}
