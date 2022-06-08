import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../enums/role.enum';
import { Roles } from '../roles/roles.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  async validarId(id: string) {
    if (id == null || id.length != 24) {
      const message = 'O id do evento informado deve conter 24 caracteres';
      throw new BadRequestException(message);
    }

    return true;
  }

  async validarAuthorPost(event: any, email: string) {
    if (event.author.email != email) {
      const message =
        'Você não esta autorizado a realizar modificações nesse evento';
      throw new UnauthorizedException(message);
    }

    return true;
  }

  @UseGuards(JwtAuthGuard)
  //@Roles(Role.ADMIN, Role.PARTCIPANT)
  @Post()
  async create(@Body() createEventDto: CreateEventDto, @Request() req: any) {
    const event = await this.eventsService.create(
      createEventDto,
      req.user.email,
    );

    if (!event) {
      const message = 'ocorreu um erro ao criar o evento';
      throw new BadRequestException(message);
    }

    return event;
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/')
  async findAll() {
    return await this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    await this.validarId(id);
    const event = await this.eventsService.findOne(id);

    if (!event) {
      const message = 'O evento não foi encontrado!';

      throw new BadRequestException(message);
    }

    return event;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req: any,
  ) {
    await this.validarId(id);

    const event: any = await this.findOne(id);

    await this.validarAuthorPost(event, req.user.email);

    return await this.eventsService.update(id, updateEventDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.PARTCIPANT)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.validarId(id);

    const event: any = await this.findOne(id);

    await this.validarAuthorPost(event, req.user.email);

    return await this.eventsService.remove(id);
  }
}
