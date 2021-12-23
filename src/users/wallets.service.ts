import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateWalletDto } from './dto/create-wallet.dto';

import { Wallet } from './entities/wallet.entity';
import { WalletsRepository } from './repositories/wallets.repository';
import { CurrenciesRepository } from 'src/currencies/repositories/currencies.repository';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletsRepository)
    private walletsRepository: WalletsRepository,
    @InjectRepository(CurrenciesRepository)
    private currenciesRepository: CurrenciesRepository,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async create(user_id: string, createWalletDto: CreateWalletDto) {
    const { currency_id, amount } = createWalletDto;

    const user = await this.usersRepository.findOne(user_id);

    if (!user) {
      throw new HttpException('Invalid user', HttpStatus.BAD_REQUEST);
    }

    const currency = await this.currenciesRepository.findOne(currency_id);

    if (!currency) {
      throw new HttpException('Invalid currency', HttpStatus.BAD_REQUEST);
    }

    const qb = getRepository(Wallet)
      .createQueryBuilder('wallets')
      .where('wallets.user_id = :user_id', { user_id })
      .andWhere('wallets.currency_id = :currency_id', { currency_id });

    const walletAlreadyExists = await qb.getOne();

    if (walletAlreadyExists) {
      throw new HttpException(
        { message: 'Wallet already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newWallet = this.walletsRepository.create({
      user_id,
      currency_id,
      amount,
    });
    const wallet = await this.walletsRepository.save(newWallet);

    return wallet;
  }

  async findAllByUserId(user_id: string) {
    const walllets = await getRepository(Wallet)
      .createQueryBuilder('wallets')
      .select([
        'wallets.id',
        'wallets.amount',
        'currencies.code',
        'currencies.name',
      ])
      .where('wallets.user_id = :user_id', { user_id })
      .innerJoin('wallets.currency', 'currencies')
      .getMany();
    return walllets;
  }

  findAll() {
    return this.walletsRepository.find();
  }

  findOne(id: string) {
    return this.walletsRepository.findOne(id);
  }
}
