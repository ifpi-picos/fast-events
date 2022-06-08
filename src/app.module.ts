import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { EventsModule } from './events/events.module';
import { PrismaMongoService } from './prisma-mongo.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptions/http-excepetion.filter';

@Module({
  imports: [UsersModule, AuthModule, EventsModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaMongoService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
