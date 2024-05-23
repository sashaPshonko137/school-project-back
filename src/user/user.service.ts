import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/utils/prisma.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<{ id: number; tag: string; hash: string; salt: string; name: string; role: string; deleted: boolean; }> {
    const user = await this.db.user.create({ data: createUserDto });
    return user;
  }

  async findAll(): Promise<{ id: number; tag: string; name: string; role: string; }[]> {
    const users = await this.db.user.findMany({ where: { deleted: false }, select: { id: true, tag: true, name: true, role: true } });
    return users;
  }

  async findOne(id: number): Promise<{ id: number; tag: string; name: string; role: string; }> {
    const user = await this.db.user.findFirst({ where: { id } });
    if (!user) {
      throw new WsException(`Пользователь с id ${id} не найден!`);
    }
    return user;
  }

  async findByTag(tag: string): Promise<{ id: number; tag: string; name: string; role: string; hash: string; salt: string; }>{
    const user = await this.db.user.findFirst({ where: { tag } });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<{ id: number; tag: string; name: string; role: string; }>{
    await this.findOne(id);
    const user = await this.db.user.update({ where: { id }, data: updateUserDto });
    return user;
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.db.user.update({ where: { id }, data: { deleted: true } });
    return { message: `Пользователь с id ${id} удален!` };
  }
}
