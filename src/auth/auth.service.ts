import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async signUp(signUpDto: SignUpDto) {
    const user =await this.userService.findByTag(signUpDto.tag);
    if (user) {
      throw new UnauthorizedException(`Пользователь с тегом ${signUpDto.tag} уже существует`);
    }
    const salt = await this.getSalt();
    const hash = await this.getHash(signUpDto.password, salt);
    const tag = signUpDto.tag;
    const name = signUpDto.name;
    const newUser = await this.userService.create({name, tag, hash, salt});
    const token = await this.jwtService.signAsync({id: newUser.id, email: newUser.tag});
    return { token };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findByTag(signInDto.tag);
    if (!user) {
      throw new UnauthorizedException(`Неверный пароль или тэг!`);
    }
    const hash = await this.getHash(signInDto.password, user.salt);
    if (hash !== user.hash) {
      throw new UnauthorizedException(`Неверный пароль или тэг!`);
    }
    const token = await this.jwtService.signAsync({id: user.id, email: user.tag});
    return { token };
  }

  async getSalt() {
    const salt = await randomBytes(16).toString('hex');
    return salt;
  }

  async getHash(password: string, salt: string) {
    const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash;
   }

   async setToken(res: Response, token: string) {
    return await res.cookie("1242", token, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
}

async removeToken(res: Response) {
    res.clearCookie("1242")
}
}
