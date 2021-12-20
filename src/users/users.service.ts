import { User } from './entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getRepository, Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { hash } from 'bcryptjs';

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

  findOne(id: number) {
    const user = this.usersRepository.findOne(id);
    return instanceToPlain(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }
}
