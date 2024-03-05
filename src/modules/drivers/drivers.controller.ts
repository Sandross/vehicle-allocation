import { DriverService } from './drivers.service';
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
import { CreateDriverDto } from './dto/create-driver-dto';
import { UpdateDriverDto } from './dto/update-driver-dto';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  findAllDrivers(@Query('name') name?: string) {
    return this.driverService.findAllDrivers(name);
  }

  @Get('/:driverId')
  findDriverById(@Param('driverId') driverId: string) {
    return this.driverService.findDriverById(+driverId);
  }

  @Post()
  createNewDriver(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.createNewDriver(createDriverDto);
  }

  @Put('/:driverId')
  updateDriver(
    @Param('driverId') driverId: string,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    return this.driverService.updateDriver(+driverId, updateDriverDto);
  }

  @Delete('/:driverId')
  deleteDriver(@Param('driverId') driverId: string) {
    return this.driverService.deleteDriver(+driverId);
  }
}
