import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateChatDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  users: UserDto[];

  @IsBoolean()
  @IsNotEmpty()
  group: boolean;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  admin_id?: number;

}


