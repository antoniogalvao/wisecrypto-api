import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrenciesRepository } from './repositories/currencies.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CurrenciesRepository])],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
})
export class CurrenciesModule {}
