import { CreateUserDto } from './../users/dto/create-user.dto';
import { SigninUserDto } from './../users/dto/signin-user.dto';
import { AuthService } from './auth.service';
import { Controller, Body, Post } from '@nestjs/common';
import { SendMailProducerService } from 'src/jobs/sendMail-producer.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private sendMailService: SendMailProducerService,
  ) {}

  @Post('signin')
  async signin(@Body() signinUserDto: SigninUserDto) {
    const token = await this.authService.signin(signinUserDto);
    return { token: token };
  }

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signup(createUserDto);

    this.sendMailService.sendMail(createUserDto);

    return { user };
  }
}
