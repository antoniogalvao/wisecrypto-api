import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsModule } from './../jobs/jobs.module';
import { UsersService } from './users.service';
import { WalletsService } from './wallets.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Wallet } from './entities/wallet.entity';
import { Currency } from 'src/currencies/entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet, Currency]), JobsModule],
  controllers: [UsersController],
  providers: [UsersService, WalletsService],
})
export class UsersModule {}
