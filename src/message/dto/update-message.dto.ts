import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  
  @IsNumber()
  @IsNotEmpty()
  id: number;

}
