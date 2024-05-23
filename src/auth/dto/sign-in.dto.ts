import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SignInDto {

  @ApiProperty({ example: 'IbraGYM' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  tag: string;
  
  @ApiProperty({ example: '1242' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  password:  string;
  
}