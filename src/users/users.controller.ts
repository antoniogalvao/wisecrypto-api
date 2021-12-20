import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('signin')
  async signin(@Body() signinUserDto: SigninUserDto) {
    const token = await this.usersService.authenticate(signinUserDto);
    return { token: token };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    await this.mailerService.sendMail({
      to: user.email,
      from: 'Wisecrypto <noreply@wisecrypto.com>',
      subject: `Welcome!`,
      text: 'Hello, ${user.firstName}, your registration has been successful',
    });

    return { user };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
