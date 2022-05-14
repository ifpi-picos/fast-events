import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';

export type User = any;
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        name: createUserDto.nome,
        roles: createUserDto.roles,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  findOne(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    // return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: id },
      data: {
        email: updateUserDto.email,
        password: updateUserDto.password,
        name: updateUserDto.nome,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
