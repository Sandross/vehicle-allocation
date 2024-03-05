import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AllocateVehicleDto {
  @ApiProperty({
    description: 'ID do veículo',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  vehicleId: string;

  @ApiProperty({
    description: 'ID do motorista',
    example: '2',
  })
  @IsNotEmpty()
  @IsString()
  driverId: string;

  @ApiProperty({
    description: 'Motivo da alocação',
    example: 'Manutenção',
  })
  @IsNotEmpty()
  @IsString()
  reason: string;
}
