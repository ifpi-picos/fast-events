import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaMongoService } from '../prisma-mongo.service';
import { PrismaPostgresService } from '../prisma-postgres.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaMongoService, PrismaPostgresService],
})
export class EventsModule {}
