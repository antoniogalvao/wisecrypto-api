import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SendMailProducerService } from 'src/jobs/sendMail-producer.service';
import { SendMailConsumer } from 'src/jobs/sendMail-consumer';
import { BullModule } from '@nestjs/bull';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }),
  ],
  providers: [SendMailProducerService, SendMailConsumer],
  exports: [SendMailProducerService, SendMailConsumer],
})
export class JobsModule {
  constructor(@InjectQueue('sendMail-queue') private sendMailQueue: Queue) {}
  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();
    createBullBoard({
      queues: [new BullAdapter(this.sendMailQueue)],
      serverAdapter: serverAdapter,
    });
    serverAdapter.setBasePath('/admin/queues');
    consumer.apply(serverAdapter.getRouter()).forRoutes('/admin/queues');
  }
}
