import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterDriverDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
