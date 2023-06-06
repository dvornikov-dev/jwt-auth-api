import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisAsyncModuleOptions } from './redis.types';
import { REDIS_CLIENT } from './redis.constants';

@Module({})
export class RedisModule {
  static async registerAsync({
    useFactory,
    imports,
    inject,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    const redisProvider = {
      provide: REDIS_CLIENT,
      useFactory: async (...args) => {
        const { redisOptions } = await useFactory(...args);

        const client = new Redis(redisOptions);

        return client;
      },
      inject,
    };

    return {
      module: RedisModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
      global: true,
    };
  }
}
