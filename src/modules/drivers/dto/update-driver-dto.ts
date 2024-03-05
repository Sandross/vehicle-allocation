import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDriverDto {
  @ApiProperty({
    description: 'Novo nome do motorista',
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;
}
