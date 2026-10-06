import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module.js';
import { CarsController } from './cars.controller.js';
import { CarsService } from './cars.service.js';

@Module({
  imports: [CommonModule],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
