import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewVehicleDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  license_plate: string;
}
