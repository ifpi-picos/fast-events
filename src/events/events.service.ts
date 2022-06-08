import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaMongoService } from '../prisma-mongo.service';
import { PrismaPostgresService } from '../prisma-postgres.service';

@Injectable()
export class EventsService {
  constructor(
    private mongo: PrismaMongoService,
    private postgres: PrismaPostgresService,
  ) {}

  createSlug(str: string) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    const to = 'aaaaeeeeiiiioooouuuunc------';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  async create(createEventDto: CreateEventDto, email: string) {
    try {
      const user = await this.postgres.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user) {
        delete user['password'];
      } else {
        return null;
      }

      return this.mongo.event.create({
        data: {
          title: createEventDto.title,
          slug: this.createSlug(createEventDto.title),
          description: createEventDto.description,
          author: user,
        },
      });
    } catch (err) {
      throw new HttpException(
        'Ocorreu um erro ao solicitar o seu pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      return this.mongo.event.findMany();
    } catch (err) {
      throw new HttpException(
        'Ocorreu um erro ao solicitar o seu pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      return this.mongo.event.findUnique({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw new HttpException(
        'Ocorreu um erro ao solicitar o seu pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    try {
      return this.mongo.event.update({
        where: {
          id: id,
        },
        data: {
          description: updateEventDto.description,
          title: updateEventDto.title,
          slug: this.createSlug(updateEventDto.title),
        },
      });
    } catch {
      throw new HttpException(
        'Ocorreu um erro ao solicitar o seu pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      return this.mongo.event.delete({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw new HttpException(
        'Ocorreu um erro ao solicitar o seu pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
