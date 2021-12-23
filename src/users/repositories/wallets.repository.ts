import { EntityRepository, Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';

@EntityRepository(Wallet)
export class WalletsRepository extends Repository<Wallet> {
  getByUserIdAndCurrencyId(
    user_id: string,
    currency_id: string,
  ): Promise<Wallet> {
    return this.createQueryBuilder('wallets')
      .where('wallets.user_id = :user_id', { user_id })
      .andWhere('wallets.currency_id = :currency_id', { currency_id })
      .getOne();
  }

  getByUserIdJoinCurrencies(user_id: string): Promise<Wallet[]> {
    return this.createQueryBuilder('wallets')
      .select([
        'wallets.id',
        'wallets.amount',
        'currencies.code',
        'currencies.name',
      ])
      .where('wallets.user_id = :user_id', { user_id })
      .innerJoin('wallets.currency', 'currencies')
      .getMany();
  }
}
