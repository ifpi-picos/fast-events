import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { LocalAuthGuard } from './local-auth-guard';
import { AuthService } from './auth.service';
//import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /*  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }*/

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() _: LoginUserDto, @Request() req) {
    return this.authService.login(req.user);
  }
}
