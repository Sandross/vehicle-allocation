import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewVehicleDto {
  @ApiProperty({
    description: 'Cor do veículo',
    example: 'Azul',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: 'Marca do veículo',
    example: 'Toyota',
  })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    description: 'Placa do veículo',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  license_plate: string;
}
