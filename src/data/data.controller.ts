import { Controller, Get, UseGuards } from '@nestjs/common';
import { DataService } from './data.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @UseGuards(AuthGuard)
  @Get('random')
  getRandomRecords(): Promise<string[]> {
    return this.dataService.getRandomRecords();
  }

  @UseGuards(AuthGuard)
  @Get('all')
  getAllRecords(): Promise<string[]> {
    return this.dataService.getAllRecords();
  }
}
