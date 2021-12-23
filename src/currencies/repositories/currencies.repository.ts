import { EntityRepository, Repository } from 'typeorm';
import { Currency } from '../entities/currency.entity';

@EntityRepository(Currency)
export class CurrenciesRepository extends Repository<Currency> {
  getOneByCode(code: string): Promise<Currency> {
    return this.createQueryBuilder('currencies')
      .where('currencies.code = :code', { code })
      .getOne();
  }
}
