import { IsNotEmpty, IsString } from 'class-validator';

export class VehiclesFiltersDto {
  @IsString()
  @IsNotEmpty()
  color?: string;

  @IsString()
  @IsNotEmpty()
  brand?: string;
}
