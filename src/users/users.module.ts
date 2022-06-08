import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaPostgresService } from '../prisma-postgres.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaPostgresService],
})
export class UsersModule {}
