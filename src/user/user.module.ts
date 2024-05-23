import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/utils/prisma.service';
import { AppGateway } from 'src/app.gateway';
import { ChatModule } from 'src/chat/chat.module';
import { MessageModule } from 'src/message/message.module';
import { MessageService } from 'src/message/message.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [UserService, PrismaService, MessageService, AuthService],
  exports: [UserService],
  imports: [ChatModule],
})
export class UserModule {}
