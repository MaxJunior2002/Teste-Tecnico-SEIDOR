import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CarsService } from '../cars/cars.service.js';
import { ActiveUsageRegistry } from '../common/active-usage-registry.js';
import { DriversService } from '../drivers/drivers.service.js';
import { CarUsage } from './car-usage.model.js';
import { CreateCarUsageDto } from './dto/create-car-usage.dto.js';
import { FinishCarUsageDto } from './dto/finish-car-usage.dto.js';

@Injectable()
export class UsagesService {
  private readonly usages = new Map<string, CarUsage>();

  constructor(
    private readonly carsService: CarsService,
    private readonly driversService: DriversService,
    private readonly activeUsageRegistry: ActiveUsageRegistry,
  ) {}

  create(createCarUsageDto: CreateCarUsageDto): CarUsage {
    const car = this.carsService.findOne(createCarUsageDto.carId);
    const driver = this.driversService.findOne(createCarUsageDto.driverId);

    const usage = new CarUsage(
      randomUUID(),
      new Date(),
      createCarUsageDto.reason,
      driver,
      car,
    );
    this.activeUsageRegistry.startUsage(car.id, driver.id);
    this.usages.set(usage.id, usage);
    return usage;
  }

  findAll(): CarUsage[] {
    return [...this.usages.values()];
  }

  finish(finishCarUsageDto: FinishCarUsageDto): CarUsage {
    this.carsService.findOne(finishCarUsageDto.carId);
    this.driversService.findOne(finishCarUsageDto.driverId);

    const usage = [...this.usages.values()].find(
      (currentUsage) =>
        currentUsage.car.id === finishCarUsageDto.carId &&
        currentUsage.driver.id === finishCarUsageDto.driverId &&
        currentUsage.endDate === null,
    );
    if (!usage) {
      throw new NotFoundException(
        `No active usage found for car "${finishCarUsageDto.carId}" and driver "${finishCarUsageDto.driverId}"`,
      );
    }

    usage.endDate = new Date();
    this.activeUsageRegistry.finishUsage(usage.car.id, usage.driver.id);
    return usage;
  }
}
