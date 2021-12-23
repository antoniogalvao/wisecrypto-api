import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { WalletsService } from './wallets.service';
import { UsersController } from './users.controller';

import { WalletsController } from './wallets.controller';
import { UsersRepository } from './repositories/users.repository';
import { WalletsRepository } from './repositories/wallets.repository';
import { CurrenciesRepository } from '../currencies/repositories/currencies.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersRepository,
      WalletsRepository,
      CurrenciesRepository,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UsersController, WalletsController],
  providers: [UsersService, WalletsService],
})
export class UsersModule {}
