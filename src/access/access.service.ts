import {
  DEFAULT_REDIS_NAMESPACE,
  RedisService,
} from '@liaoliaots/nestjs-redis';
import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class AccessService {
  private readonly redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient(DEFAULT_REDIS_NAMESPACE);
  }

  async findAll() {
    try {
      const keys = this.redis.keys('*');

      if (!keys) {
        return 'Nenhum registro foi encontrado';
      }

      return keys;
    } catch (e) {
      throw new HttpException(
        'Ocorreu um erro ao solicitar o seu pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(pagina: any) {
    try {
      const num = await this.redis.get(pagina);
      if (!num) {
        return 'A pagina informada não foi enconrada';
      }

      return num;
    } catch (e) {
      throw new HttpException(
        'Ocorreu um erro ao solicitar o seu pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(pagina: string) {
    try {
      const num = await this.redis.get(pagina);
      if (!num) {
        return 'A pagina informada não foi enconrada';
      }

      this.redis.del(pagina);

      return 'A pagina informada foi removida';
    } catch (e) {
      throw new HttpException(
        'Ocorreu um erro ao solicitar o seu pedido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async ping(): Promise<string> {
    const p = await this.redis.ping();

    console.log(p);
    return p;
  }
}
