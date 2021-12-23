import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateWalletDto } from './dto/create-wallet.dto';

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

    const walletAlreadyExists =
      await this.walletsRepository.getByUserIdAndCurrencyId(
        user_id,
        currency_id,
      );

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
    const wallets = await this.walletsRepository.getByUserIdJoinCurrencies(
      user_id,
    );
    return wallets;
  }

  findAll() {
    return this.walletsRepository.find();
  }

  findOne(id: string) {
    return this.walletsRepository.findOne(id);
  }
}
