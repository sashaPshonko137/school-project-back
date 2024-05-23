import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/utils/prisma.service';
import { UserService } from 'src/user/user.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class MessageService {
  constructor(private db: PrismaService, private chatService: ChatService, private userService: UserService) {}
  async create(createMessageDto: CreateMessageDto): Promise<{ id: number; text: string; chat_id: number; user_id: number; }>{
    await this.chatService.findOne(createMessageDto.chat_id);
    await this.userService.findOne(createMessageDto.user_id);
    const message = await this.db.message.create({ data: createMessageDto });
    return message;
  }

  async findAll(): Promise<{ id: number; text: string; chat_id: number; user_id: number; }[]> {
    const messages = await this.db.message.findMany();
    return messages;
  }

  async findOne(id: number): Promise<{ id: number; text: string; chat_id: number; user_id: number; }>{
    const message = await this.db.message.findFirst({ where: { id } });
    if (!message) {
      throw new WsException(`Сообщение с id ${id} не найдено!`);
    }
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto): Promise<{ id: number; text: string; chat_id: number; user_id: number; }>{
    await this.findOne(id);
    const message = await this.db.message.update({ where: { id }, data: updateMessageDto });
    return message;
  }

  async remove(id: number): Promise<{ message: string }>{
    await this.findOne(id);
    await this.db.message.delete({ where: { id } });
    return { message: `Сообщение с id ${id} удалено.` };
  }
}
