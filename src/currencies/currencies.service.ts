import { Currency } from './entities/currency.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { getRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private currenciesRepository: Repository<Currency>,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    const { code, name } = createCurrencyDto;

    const qb = getRepository(Currency)
      .createQueryBuilder('currencies')
      .where('currencies.code = :code', { code });
    const currencyAlreadyExists = await qb.getOne();

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