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
  Res,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../enums/role.enum';
import { Roles } from '../roles/roles.decorator';

const badRequest = {
  statusCode: HttpStatus.BAD_REQUEST,
  success: false,
  message: '',
};

const unauthorized = {
  statusCode: HttpStatus.UNAUTHORIZED,
  success: false,
  message: '',
};

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  //@Roles(Role.ADMIN, Role.PARTCIPANT)
  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
    @Request() req: any,
    @Res() res,
  ) {
    const event = await this.eventsService.create(
      createEventDto,
      req.user.email,
    );

    if (!event) {
      badRequest['message'] = 'ocorre um erro ao criar o evento';
      return res.status(badRequest.statusCode).json(badRequest);
    }

    const data = {
      statusCode: 201,
      data: event,
      success: true,
    };

    return res.status(201).json(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    //console.log(id);
    if (id.length != 24) {
      badRequest['message'] =
        'O id do evento informado deve conter 24 caracteres';
      return res.status(badRequest.statusCode).json(badRequest);
    }

    const event = await this.eventsService.findOne(id);
    if (!event) {
      badRequest['message'] = 'O evento não foi encontrado!';
      return res.status(badRequest.statusCode).json(badRequest);
    }

    const data = {
      statusCode: 200,
      success: true,
      data: event,
    };

    return res.status(200).json(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req: any,
    @Res() res,
  ) {
    if (id.length != 24) {
      badRequest['message'] =
        'O id do evento informado deve conter 24 caracteres';
      return res.status(badRequest.statusCode).json(badRequest);
    }

    const event: any = await this.eventsService.findOne(id);
    if (!event) {
      badRequest['message'] = 'O evento não foi encontrado!';
      return res.status(badRequest.statusCode).json(badRequest);
    }

    if (event.author.email != req.user.email) {
      unauthorized['message'] =
        'Você não esta autorizado a alterar esse evento';
      return res.status(unauthorized.statusCode).json(unauthorized);
    }

    const update = await this.eventsService.update(id, updateEventDto);

    const data = {
      statusCode: 200,
      success: true,
      data: update,
    };

    return res.status(200).json(data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.PARTCIPANT)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any, @Res() res) {
    if (id.length != 24) {
      badRequest['message'] =
        'O id do evento informado deve conter 24 caracteres';
      return res.status(HttpStatus.BAD_REQUEST).json(badRequest);
    }

    const event: any = await this.eventsService.findOne(id);
    if (!event) {
      badRequest['message'] = 'O evento não foi encontrado!';
      return res.status(badRequest.statusCode).json(badRequest);
    }

    if (event.author.email != req.user.email) {
      unauthorized['message'] =
        'Você não esta autorizado a remover esse evento';
      return res.status(unauthorized.statusCode).json(unauthorized);
    }

    const remove = await this.eventsService.remove(id);

    const data = {
      statusCode: 200,
      success: true,
      data: remove,
    };

    return res.status(200).json(data);
  }
}
