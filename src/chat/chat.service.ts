import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/utils/prisma.service';
import { UserService } from 'src/user/user.service';
import { UserDto } from './dto/user.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {

  constructor( private db: PrismaService, private userService: UserService ) {}

  async create(createChatDto: CreateChatDto): Promise<{ id: number, name: string, group: boolean, admin_id: number }> {
    if (!createChatDto.group && createChatDto.users.length !== 2) {
      throw new WsException(`В личном чате должно быть два участника!`);
    }
    if (createChatDto.group && !createChatDto.admin_id) {
      throw new WsException(`Необходимо указать администратора группы!`);
    }
    if (createChatDto.group && createChatDto.admin_id && !createChatDto.users.find(user => user.id === createChatDto.admin_id)) {
      throw new WsException(`Пользователя с id ${createChatDto.admin_id} нет в группе!`);
    }
    const chat = await this.db.chat.create({ data: { name: createChatDto.name, group: createChatDto.group, admin_id: createChatDto.admin_id  } });
    await this.addUsers(chat.id, createChatDto.users);
    return chat;
  }

  async addUsers(chat_id: number, users: UserDto[]): Promise<void> {
    users.forEach(async user => {
      await this.userService.findOne(user.id);
    });
    await this.db.chatUser.createMany({
      data: users.map(user => {
        return {
          chat_id: chat_id,
          user_id: user.id
        }
      })
    });
  }

  async findAll(): Promise<{ id: number; name: string }[]> {
    const chats = await this.db.chat.findMany();
    return chats;
  }

  async findOne(id: number): Promise<{ id: number; name: string }> {
    const chat = await this.db.chat.findFirst({where: { id }});
    if (!chat) {
      throw new WsException(`Чат с id ${id} не найден!`);
    }
    return chat;
  }

  async update(id: number, updateChatDto: UpdateChatDto): Promise<{ id: number; name: string }>{
    await this.findOne(id);
    const chat = await this.db.chat.update({ where: { id }, data: {name: updateChatDto.name, } });
    return chat;
  }

  async remove(id: number): Promise<{ message: string }> {
    this.findOne(id);
    await this.db.chat.delete({where: { id }});
    await this.db.chatUser.deleteMany({ where: { chat_id: id } });
    await this.db.message.deleteMany({ where: { chat_id: id } });
    return { message: `Чат с id ${id} удален.` };
  }
}
