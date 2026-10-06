import { Car } from '../cars/car.model.js';
import { Driver } from '../drivers/driver.model.js';

export class CarUsage {
  constructor(
    public id: string,
    public startDate: Date,
    public reason: string,
    public driver: Driver,
    public car: Car,
    public endDate: Date | null = null,
  ) {}
}
