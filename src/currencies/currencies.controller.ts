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
  async findAll() {
    return await this.currenciesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.currenciesService.findOne(id);
  }
}
