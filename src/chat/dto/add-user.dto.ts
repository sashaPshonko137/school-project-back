import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class AddUserDto {

  @IsNumber()
  @IsNotEmpty()
  chat_id: number;

  @IsArray()
  @IsNotEmpty()
  users: UserDto[];

}