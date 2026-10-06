import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class ActiveUsageRegistry {
  private readonly carUsageById = new Map<string, string>();
  private readonly driverUsageById = new Map<string, string>();

  startUsage(carId: string, driverId: string): void {
    if (this.carUsageById.has(carId)) {
      throw new ConflictException(`Car with ID "${carId}" is already in use`);
    }
    if (this.driverUsageById.has(driverId)) {
      throw new ConflictException(
        `Driver with ID "${driverId}" is already using a car`,
      );
    }

    this.carUsageById.set(carId, driverId);
    this.driverUsageById.set(driverId, carId);
  }

  finishUsage(carId: string, driverId: string): void {
    this.carUsageById.delete(carId);
    this.driverUsageById.delete(driverId);
  }

  isCarInUse(carId: string): boolean {
    return this.carUsageById.has(carId);
  }

  isDriverInUse(driverId: string): boolean {
    return this.driverUsageById.has(driverId);
  }
}
