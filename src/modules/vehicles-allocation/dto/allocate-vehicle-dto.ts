import { IsNotEmpty, IsString } from 'class-validator';

export class AllocateVehicleDto {
  @IsNotEmpty()
  @IsString()
  vehicleId: string;

  @IsNotEmpty()
  @IsString()
  driverId: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}
