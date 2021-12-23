import { Controller, Body, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SendMailProducerService } from 'src/jobs/sendMail-producer.service';

import { CredentialsDto } from './dto/credentials.dto';
import { CreateUserDto } from './../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private sendMailService: SendMailProducerService,
  ) {}

  @Post('session')
  async signin(@Body() credentialsDto: CredentialsDto) {
    const token = await this.authService.signin(credentialsDto);
    return { token: token };
  }

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signup(createUserDto);

    this.sendMailService.sendMail(createUserDto);

    return { user };
  }
}
