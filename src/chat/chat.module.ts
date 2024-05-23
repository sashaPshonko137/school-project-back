import { Module } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { AppGateway } from 'src/app.gateway';
import { MessageModule } from 'src/message/message.module';
import { AuthService } from 'src/auth/auth.service';


@Module({
  controllers: [],
  providers: [ChatService, PrismaService, UserService, AuthService],
  exports: [ChatService],
  imports: [MessageModule]
})
export class ChatModule {}