import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {

    @IsNumber()
    @IsNotEmpty()
    chat_id: number;

    @IsNumber()
    @IsNotEmpty()
    user_id: number;

    @IsString()
    @IsNotEmpty()
    text: string;
    
}
