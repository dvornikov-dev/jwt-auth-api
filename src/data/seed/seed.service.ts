import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.constants';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async onModuleInit() {
    await this.runSeed();
  }

  async runSeed() {
    const promises = Array.from({ length: 20 }, async (_, i) => {
      const key = `key${i}`;

      const value = `value${i}`;

      const keyExists = await this.redisClient.get(key);

      if (!keyExists) {
        await this.redisClient.set(key, value);
      }
    });

    return Promise.all(promises);
  }
}
