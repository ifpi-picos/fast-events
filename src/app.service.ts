import { Injectable } from '@nestjs/common';
import { PrismaMongoService } from './prisma-mongo.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaMongoService) {}
  getHello(): string {
    this.prisma.event.findMany();
    return 'Welcome to the FAST EVENTS!';
  }
}
