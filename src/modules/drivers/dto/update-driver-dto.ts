import { IsNotEmpty } from 'class-validator';

export class UpdateDriverDto {
  @IsNotEmpty()
  name: string;
}
