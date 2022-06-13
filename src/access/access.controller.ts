import { Controller, Get, Body, Delete } from '@nestjs/common';
import { AccessService } from './access.service';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get()
  findAll() {
    return this.accessService.findAll();
  }

  @Get('/search')
  findOne(@Body() params) {
    if (!params.pagina) {
      //{"pagina": "pagina:/access/ping:13-5-2022"}
      return 'A pagina informada é invalida';
    }

    return this.accessService.findOne(params.pagina);
  }

  @Get('/ping')
  ping() {
    return this.accessService.ping();
  }

  @Delete()
  remove(@Body() params) {
    if (!params.pagina) {
      //{"pagina": "pagina:/access/ping:13-5-2022"}
      return 'A pagina informada é invalida';
    }
    return this.accessService.remove(params.pagina);
  }
}
