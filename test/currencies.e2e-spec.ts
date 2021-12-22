import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CurrenciesModule } from './../src/currencies/currencies.module';
import { CurrenciesService } from './../src/currencies/currencies.service';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Currencies', () => {
  let app: INestApplication;
  const currenciesService = {
    findAll: () => ['test'],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CurrenciesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'test',
          password: 'password',
          database: 'testdb',
          entities: ['./**/*.entity.ts'],
          synchronize: false,
        }),
      ],
    })
      .overrideProvider(CurrenciesService)
      .useValue(currenciesService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`/GET currencies`, () => {
    return request(app.getHttpServer())
      .get('/currencies')
      .expect(200)
      .expect(currenciesService.findAll());
  });

  afterAll(async () => {
    await app.close();
  });
});
