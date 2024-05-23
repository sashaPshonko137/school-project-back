import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user/user.service';
import { ChatService } from './chat/chat.service';
import { MessageService } from './message/message.service';
import { UpdateUserDto } from './user/dto/update-user.dto';
import { CreateChatDto } from './chat/dto/create-chat.dto';
import { AddUserDto } from './chat/dto/add-user.dto';
import { UpdateChatDto } from './chat/dto/update-chat.dto';
import { CreateMessageDto } from './message/dto/create-message.dto';
import { UpdateMessageDto } from './message/dto/update-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*'
  },
})

export class AppGateway implements OnGatewayConnection {
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private messageService: MessageService,
  ) {}
  @WebSocketServer() wss: Server;
  handleConnection(client: any, ...args: any[]) {
    console.log(client.id);
  }

  
  @SubscribeMessage('createChat')
  async createChat(@MessageBody() createChatDto: CreateChatDto) {
    const chat = await this.chatService.create(createChatDto);
    return this.wss.to(`chat${chat.id}`).emit('createChat', `${chat}`);
  }

  @SubscribeMessage('addUsers')
  async addUsers(@MessageBody() addUserDto: AddUserDto) {
    const { chat_id, users } = addUserDto;
    await this.chatService.addUsers(chat_id, users);
    return this.wss.to(`chat${chat_id}`).emit('addUsers', `Пользователи добавлены в чат.`);
  }

  @SubscribeMessage('findAllChat')
  async findAllChats(@MessageBody() client_id: {id: string}) {
    const message = await this.chatService.findAll();
    console.log(message)
    console.log(client_id)
    const id = client_id.id;
    const client = this.wss.sockets.sockets.get(id);
    return client.emit('findAllChat', `${message}`);
  }

  @SubscribeMessage('findOneChat')
  async findOneChat(@MessageBody() value: {id: number, client_id: string}) {
    const message = await this.chatService.findOne(value.id);
    this.wss.emit('findOneChat', `${message}`);
    const client_id = value.client_id;
    const client = this.wss.sockets.sockets.get(client_id);
    return client.emit('findAllChat', `${message}`);
  }

  @SubscribeMessage('updateChat')
  async updateChat(@MessageBody() updateChatDto: UpdateChatDto) {
    const message = await this.chatService.update(updateChatDto.id, updateChatDto);
    return this.wss.emit('updateChat', `${message}`);
  }

  @SubscribeMessage('removeChat')
  async removeChat(@MessageBody() id: number) {
    await this.chatService.remove(id);
    return this.wss.to(`chat${id}`).emit('removeChat', `${id}`);
  }

  @SubscribeMessage('findAllUser')
  async findAllUsers(@MessageBody() client_id: {id: string}) {
    const message = await this.userService.findAll();
    const id = client_id.id;
    const client = this.wss.sockets.sockets.get(id);
    return client.emit('findAllUser', `${message}`);
  }

  @SubscribeMessage('findOneUser')
  async findOneUser(@MessageBody() value: {id: number, client_id: string}) {
    const id = value.id;
    const client = this.wss.sockets.sockets.get(value.client_id);
    const message = await this.userService.findOne(id);
    return client.emit('findOneUser', `${message}`);
  }

  @SubscribeMessage('updateUser')
  updateUser(@MessageBody() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.id, updateUserDto);
  }

  @SubscribeMessage('removeUser')
  removeUser(@MessageBody() id: number) {
    return this.userService.remove(id);
  }

  @SubscribeMessage('createMessage')
  async createMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messageService.create(createMessageDto);
    return this.wss.to(`chat${message.chat_id}`).emit('createdMessage', `${message}`);
  }

  @SubscribeMessage('findAllMessage')
  async findAllMessages(@MessageBody() client_id: {id: string}) {
    const message = await this.messageService.findAll();
    const id = client_id.id;
    const client = this.wss.sockets.sockets.get(id);
    return client.emit('findAllMessage', `${message}`);
  }

  @SubscribeMessage('findOneMessage')
  async findOneMessage(@MessageBody() value: {id: number, client_id: string}) {
    const id = value.id;
    const client = this.wss.sockets.sockets.get(value.client_id);
    const message = await this.messageService.findOne(id);
    return client.emit('findOneMessage', `${message}`);
  }

  @SubscribeMessage('updateMessage')
  updateMessage(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  removeMessage(@MessageBody() id: number) {
    return this.messageService.remove(id);
  }
}
