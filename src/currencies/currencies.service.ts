import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrenciesRepository } from './repositories/currencies.repository';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(CurrenciesRepository)
    private currenciesRepository: CurrenciesRepository,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    const { code, name } = createCurrencyDto;

    const currencyAlreadyExists = await this.currenciesRepository.getOneByCode(
      code,
    );

    if (currencyAlreadyExists) {
      const errors = { code: 'Must be unique' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCurrency = this.currenciesRepository.create({ code, name });
    const currency = await this.currenciesRepository.save(newCurrency);

    return currency;
  }

  findAll() {
    return this.currenciesRepository.find();
  }

  findOne(id: string) {
    return this.currenciesRepository.findOne(id);
  }
}
