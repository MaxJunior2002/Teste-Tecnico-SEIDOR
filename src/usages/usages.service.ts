import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CarsService } from '../cars/cars.service.js';
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
  ) {}

  create(createCarUsageDto: CreateCarUsageDto): CarUsage {
    const car = this.carsService.findOne(createCarUsageDto.carId);
    const driver = this.driversService.findOne(createCarUsageDto.driverId);

    if (this.isCarInUse(car.id)) {
      throw new ConflictException(`Car with ID "${car.id}" is already in use`);
    }
    if (this.isDriverInUse(driver.id)) {
      throw new ConflictException(
        `Driver with ID "${driver.id}" is already using a car`,
      );
    }

    const usage = new CarUsage(
      randomUUID(),
      new Date(),
      createCarUsageDto.reason,
      driver,
      car,
    );
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
    return usage;
  }

  private isCarInUse(carId: string): boolean {
    return [...this.usages.values()].some(
      (usage) => usage.car.id === carId && usage.endDate === null,
    );
  }

  private isDriverInUse(driverId: string): boolean {
    return [...this.usages.values()].some(
      (usage) => usage.driver.id === driverId && usage.endDate === null,
    );
  }
}
