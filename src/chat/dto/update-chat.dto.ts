import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateChatDto extends PartialType(CreateChatDto) {

  @IsNumber()
  @IsNotEmpty()
  id: number;

}
