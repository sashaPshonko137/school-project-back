import { Module } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { UserService } from 'src/user/user.service';
import { MessageService } from './message.service';
import { ChatService } from 'src/chat/chat.service';
import { AppGateway } from 'src/app.gateway';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [],
  providers: [MessageService, PrismaService, UserService, ChatService, AppGateway, AuthService],
  exports: [MessageService],
})
export class MessageModule {}
