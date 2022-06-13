import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import {
  DEFAULT_REDIS_NAMESPACE,
  RedisService,
} from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  private readonly redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient(DEFAULT_REDIS_NAMESPACE);
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const { originalUrl } = request;

    response.on('finish', () => {
      const d = new Date();
      const data =
        'pagina:' +
        originalUrl +
        ':' +
        d.getUTCDate() +
        '-' +
        (d.getUTCMonth() + 1) +
        '-' +
        d.getFullYear();
      // console.log(data);
      this.redis.incr(data);
      this.logger.log(`${originalUrl}`);
    });

    next();
  }
}
