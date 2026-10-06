import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ActiveUsageRegistry } from '../common/active-usage-registry.js';
import { Driver } from './driver.model.js';
import { CreateDriverDto } from './dto/create-driver.dto.js';
import { ListDriversQueryDto } from './dto/list-drivers-query.dto.js';
import { UpdateDriverDto } from './dto/update-driver.dto.js';

@Injectable()
export class DriversService {
  private readonly drivers = new Map<string, Driver>();

  constructor(private readonly activeUsageRegistry: ActiveUsageRegistry) {}

  create(createDriverDto: CreateDriverDto): Driver {
    const driver = new Driver(randomUUID(), createDriverDto.name);
    this.drivers.set(driver.id, driver);
    return driver;
  }

  findAll(filters: ListDriversQueryDto = {}): Driver[] {
    const name = filters.name?.trim().toLowerCase();

    return [...this.drivers.values()].filter(
      (driver) => !name || driver.name.toLowerCase().includes(name),
    );
  }

  findOne(id: string): Driver {
    const driver = this.drivers.get(id);
    if (!driver) {
      throw new NotFoundException(`Driver with ID "${id}" was not found`);
    }
    return driver;
  }

  update(id: string, updateDriverDto: UpdateDriverDto): Driver {
    this.findOne(id);

    const driver = new Driver(id, updateDriverDto.name);
    this.drivers.set(id, driver);
    return driver;
  }

  remove(id: string): void {
    this.findOne(id);
    if (this.activeUsageRegistry.isDriverInUse(id)) {
      throw new ConflictException(
        `Cannot delete driver with ID "${id}" while they are using a car`,
      );
    }
    this.drivers.delete(id);
  }
}
