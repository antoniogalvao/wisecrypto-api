import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Processor('sendMail-queue')
class SendMailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob(job: Job<CreateUserDto>) {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.email,
      from: 'Wisecrypto <noreply@wisecrypto.com>',
      subject: `Welcome!`,
      text: `Hello, ${data.firstName}, your registration has been successful`,
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`On Completed ${job.name}`);
  }

  @OnQueueProgress()
  onQueueProgress(job: Job) {
    console.log(`On Progress ${job.name}`);
  }

  @OnQueueActive()
  onQueueActive(job: Job) {
    console.log(`On Active ${job.name}`);
  }
}

export { SendMailConsumer };
