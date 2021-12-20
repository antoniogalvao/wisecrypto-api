import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, password } = createUserDto;

    // check uniqueness of email
    const qb = getRepository(User)
      .createQueryBuilder('users')
      .where('users.email = :email', { email });
    const userAlreadyExists = await qb.getOne();

    if (userAlreadyExists) {
      const errors = { email: 'Must be unique' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await hash(password, 8);

    const newUser = this.usersRepository.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: passwordHash,
    });

    const user = await this.usersRepository.save(newUser);

    return instanceToPlain(user);
  }

  findAll() {
    const users = this.usersRepository.find();
    return instanceToPlain(users);
  }

  findOne(id: string) {
    const user = this.usersRepository.findOne(id);
    return instanceToPlain(user);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    await this.usersRepository.delete(id);
  }

  async authenticate(signinUserDto: SigninUserDto) {
    const { email, password } = signinUserDto;
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new HttpException(
        'Email/Password incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new HttpException(
        'Email/Password incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = sign({ email }, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: '1d',
    });

    return token;
  }
}
