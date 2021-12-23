import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { WalletsService } from './wallets.service';
import { UsersController } from './users.controller';

import { User } from './entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { Currency } from 'src/currencies/entities/currency.entity';
import { WalletsController } from './wallets.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet, Currency]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UsersController, WalletsController],
  providers: [UsersService, WalletsService],
})
export class UsersModule {}
