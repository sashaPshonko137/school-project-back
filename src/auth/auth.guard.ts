import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService, authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ) {
    const code = "1242";
    const req = context.switchToHttp().getRequest() as Request
    const token = req.cookies[code];
    if (!token) {
      throw new UnauthorizedException('Необходимо авторизоваться!');
    }

    try {
      const data =this.jwtService.verifyAsync(token, { secret: "1242" });
      req['session'] = data;
    } catch (error) {
      
    }
    return true;
  }
}
