import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VehiclesFiltersDto {
  @ApiProperty({
    description: 'Cor do veículo (opcional)',
    example: 'Azul',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: 'Marca do veículo (opcional)',
    example: 'Toyota',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  brand?: string;
}
