import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {

  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
