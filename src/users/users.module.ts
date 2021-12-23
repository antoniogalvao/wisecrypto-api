import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { WalletsService } from './wallets.service';
import { UsersController } from './users.controller';

import { User } from './entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { Currency } from 'src/currencies/entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet, Currency])],
  controllers: [UsersController],
  providers: [UsersService, WalletsService],
})
export class UsersModule {}
