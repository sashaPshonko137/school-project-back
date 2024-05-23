import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  tag: string;
  hash:  string;
  salt:  string;
  name:  string;
}
