import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.constants';

@Injectable()
export class DataService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async getRandomRecords() {
    const keys = await this.redisClient.keys('*');
    const randomKeys = keys
      .sort(() => Math.random() - Math.random())
      .slice(0, 10);

    return Promise.all(randomKeys.map((key) => this.redisClient.get(key)));
  }

  async getAllRecords() {
    const keys = await this.redisClient.keys('*');

    return Promise.all(keys.map((key) => this.redisClient.get(key)));
  }
}
