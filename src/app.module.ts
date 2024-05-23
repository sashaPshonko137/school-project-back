import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ChatModule, UserModule, MessageModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
