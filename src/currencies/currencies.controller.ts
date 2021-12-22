import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  async create(@Body() createCurrencyDto: CreateCurrencyDto) {
    const user = await this.currenciesService.create(createCurrencyDto);

    return { user };
  }

  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currenciesService.findOne(id);
  }
}
