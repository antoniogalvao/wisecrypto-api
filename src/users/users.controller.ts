import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletsService } from './wallets.service';
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
    private readonly walletsService: WalletsService,
    private sendMailService: SendMailProducerService,
  ) {}

  @Post('signin')
  async signin(@Body() signinUserDto: SigninUserDto) {
    const token = await this.usersService.authenticate(signinUserDto);
    return { token: token };
  }

  @Post('wallets')
  async createWallet(@Body() createWalletDto: CreateWalletDto) {
    return await this.walletsService.create(createWalletDto);
  }

  @Get('wallets')
  async findAllWallets() {
    return await this.walletsService.findAll();
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
