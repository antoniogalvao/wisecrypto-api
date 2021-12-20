import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsModule } from './../jobs/jobs.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JobsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
