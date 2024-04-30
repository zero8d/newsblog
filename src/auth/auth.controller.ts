import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public-strategy';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sendCode')
  @Public()
  @ApiTags('Auth')
  sendCode(@Body() body: SendCodeDto) {
    return this.authService.sendCode(body.phone);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verifyCode')
  @Public()
  @ApiTags('Auth')
  verifyCode(@Body() body: VerifyCodeDto) {
    return this.authService.verifyCode(body.phone, body.code);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @ApiTags('Auth')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('profile')
  @ApiTags('Profile')
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  }
}
