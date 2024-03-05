import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterDriverDto {
  @ApiProperty({
    description: 'Nome do motorista (opcional)',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
