import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletsService } from './wallets.service';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser } from 'src/auth/get-user-decorator';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @UseGuards(AuthGuard())
  async createWallet(
    @GetUser() user: User,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    return await this.walletsService.create(user.id, createWalletDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  async findAllWallets(@GetUser() user: User) {
    return await this.walletsService.findAllByUserId(user.id);
  }
}
