import { Module } from '@nestjs/common';
import { CarsModule } from '../cars/cars.module.js';
import { DriversModule } from '../drivers/drivers.module.js';
import { UsagesController } from './usages.controller.js';
import { UsagesService } from './usages.service.js';

@Module({
  imports: [CarsModule, DriversModule],
  controllers: [UsagesController],
  providers: [UsagesService],
})
export class UsagesModule {}
