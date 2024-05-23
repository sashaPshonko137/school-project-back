import { ApiProperty } from "@nestjs/swagger";

export class SessionDto {

  @ApiProperty()
  tag: string;

  @ApiProperty()
  id:  number;

}