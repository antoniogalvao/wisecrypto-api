import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
class SendMailProducerService {
  constructor(@InjectQueue('sendMail-queue') private queue: Queue) {}
  async sendMail(createUserDto: CreateUserDto) {
    this.queue.add('sendMail-job', createUserDto, {
      delay: 5000,
    });
  }
}

export { SendMailProducerService };
