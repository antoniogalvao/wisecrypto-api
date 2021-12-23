import { EntityRepository, Repository } from 'typeorm';
import { Currency } from '../entities/currency.entity';

@EntityRepository(Currency)
export class CurrenciesRepository extends Repository<Currency> {}
