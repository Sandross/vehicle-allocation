import { PartialType } from '@nestjs/swagger';
import { CreateNewVehicleDto } from './create-new-vehicle-dto';

export class UpdateVehicleDto extends PartialType(CreateNewVehicleDto) {}
