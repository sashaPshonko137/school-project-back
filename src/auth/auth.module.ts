import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/utils/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [UserModule, JwtModule.register({
    global: true,
    secret: "1242",
    signOptions: {expiresIn: '30d'}
  })],
  controllers: [AuthController]
})
export class AuthModule {}
