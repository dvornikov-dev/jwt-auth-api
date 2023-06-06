import { ModuleMetadata, FactoryProvider } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export type RedisModuleOptions = {
  redisOptions: RedisOptions;
};

export type RedisAsyncModuleOptions = {
  useFactory: (...args: any[]) => Promise<RedisModuleOptions>;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;
