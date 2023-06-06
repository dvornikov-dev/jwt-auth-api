import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import redisConfig from './config/redis.config';
import mongoConfig from './config/mongo.config';
import { RedisModule } from './redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, redisConfig, mongoConfig],
    }),
    RedisModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redisOptions: {
          port: configService.get('redis.port'),
          host: configService.get('redis.host'),
        },
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongo.uri'),
      }),
    }),
    AuthModule,
    UserModule,
    DataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
