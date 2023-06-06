import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { SeedService } from './seed/seed.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DataController],
  providers: [DataService, SeedService],
})
export class DataModule {}
