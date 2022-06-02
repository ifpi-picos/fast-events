import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaMongoService } from '../prisma2.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaMongoService, PrismaService],
})
export class EventsModule {}
