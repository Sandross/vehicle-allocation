import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({
    description: 'Nome do motorista',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
