import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('gelato')
  getGelato(): string {
    return 'gelato 4시에 오픈함';
  }
  @Get('arom')
  getArom(): string {
    return '아롬베이크';
  }
}
