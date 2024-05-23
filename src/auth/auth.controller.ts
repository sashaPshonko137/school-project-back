import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import { SessionDto } from './dto/session.dto';
import { SessionData } from './session-data.decorator';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response<any, Record<string, any>>,
  ) {
    const { token } = await this.authService.signUp(signUpDto);
    this.authService.setToken(res, token);
    return { token };
  }

  @Post('signIn')
  @ApiCreatedResponse()
  @ApiOkResponse()
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.signIn(signInDto);
    this.authService.setToken(res, token);
    return { token }
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  async signOut(@Res({passthrough: true}) res: Response) {
    this.authService.removeToken(res);
  }

  @Get('session')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: SessionDto })
  getSessionData(@SessionData() session: SessionDto) {
    return session;
  }
}
