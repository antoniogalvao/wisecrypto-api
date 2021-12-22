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
import { SendMailProducerService } from '../jobs/sendMail-producer.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private sendMailService: SendMailProducerService,
  ) {}

  @Post('signin')
  async signin(@Body() signinUserDto: SigninUserDto) {
    const token = await this.usersService.authenticate(signinUserDto);
    return { token: token };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    this.sendMailService.sendMail(createUserDto);

    return { user };
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
