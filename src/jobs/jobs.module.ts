import { Module } from '@nestjs/common';
import { SendMailProducerService } from 'src/jobs/sendMail-producer.service';
import { SendMailConsumer } from 'src/jobs/sendMail-consumer';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }),
  ],
  providers: [SendMailProducerService, SendMailConsumer],
  exports: [SendMailProducerService, SendMailConsumer],
})
export class JobsModule {}
