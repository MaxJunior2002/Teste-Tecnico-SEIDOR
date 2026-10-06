import { ConflictException, NotFoundException } from '@nestjs/common';
import { CarsService } from '../cars/cars.service.js';
import { DriversService } from '../drivers/drivers.service.js';
import { CarUsage } from './car-usage.model.js';
import { UsagesService } from './usages.service.js';

describe('UsagesService', () => {
  let carsService: CarsService;
  let driversService: DriversService;
  let service: UsagesService;

  beforeEach(() => {
    carsService = new CarsService();
    driversService = new DriversService();
    service = new UsagesService(carsService, driversService);
  });

  function createCar(plate = 'ABC-1234') {
    return carsService.create({ plate, color: 'Blue', brand: 'Honda' });
  }

  function createDriver(name = 'Maria Silva') {
    return driversService.create({ name });
  }

  it('starts a usage and includes the car and driver details', () => {
    const car = createCar();
    const driver = createDriver();

    const usage = service.create({
      carId: car.id,
      driverId: driver.id,
      reason: 'Visit a customer',
    });

    expect(usage).toBeInstanceOf(CarUsage);
    expect(usage.startDate).toBeInstanceOf(Date);
    expect(usage.endDate).toBeNull();
    expect(usage.car).toEqual(car);
    expect(usage.driver).toEqual(driver);
    expect(usage.reason).toBe('Visit a customer');
    expect(service.findAll()).toEqual([usage]);
  });

  it('does not allow a car to be used by more than one driver at a time', () => {
    const car = createCar();
    const firstDriver = createDriver();
    const secondDriver = createDriver('Joao Santos');

    service.create({
      carId: car.id,
      driverId: firstDriver.id,
      reason: 'First trip',
    });

    expect(() =>
      service.create({
        carId: car.id,
        driverId: secondDriver.id,
        reason: 'Second trip',
      }),
    ).toThrow(ConflictException);
  });

  it('does not allow a driver to use more than one car at a time', () => {
    const firstCar = createCar();
    const secondCar = createCar('DEF-5678');
    const driver = createDriver();

    service.create({
      carId: firstCar.id,
      driverId: driver.id,
      reason: 'First trip',
    });

    expect(() =>
      service.create({
        carId: secondCar.id,
        driverId: driver.id,
        reason: 'Second trip',
      }),
    ).toThrow(ConflictException);
  });

  it('finishes a usage by its driver and allows reuse', () => {
    const car = createCar();
    const driver = createDriver();
    service.create({
      carId: car.id,
      driverId: driver.id,
      reason: 'Business trip',
    });

    const finishedUsage = service.finish({
      carId: car.id,
      driverId: driver.id,
    });

    expect(finishedUsage.endDate).toBeInstanceOf(Date);
    expect(
      service.create({
        carId: car.id,
        driverId: driver.id,
        reason: 'Another trip',
      }).endDate,
    ).toBeNull();
  });

  it('throws when no active usage exists for the car', () => {
    expect(() =>
      service.finish({ carId: 'missing', driverId: 'missing' }),
    ).toThrow(NotFoundException);

    const car = createCar();
    const driver = createDriver();
    service.create({
      carId: car.id,
      driverId: driver.id,
      reason: 'Business trip',
    });
    service.finish({ carId: car.id, driverId: driver.id });

    expect(() =>
      service.finish({ carId: car.id, driverId: driver.id }),
    ).toThrow(NotFoundException);
  });

  it('does not allow another driver to finish an active usage', () => {
    const car = createCar();
    const assignedDriver = createDriver();
    const otherDriver = createDriver('Joao Santos');
    const usage = service.create({
      carId: car.id,
      driverId: assignedDriver.id,
      reason: 'Business trip',
    });

    expect(() =>
      service.finish({ carId: car.id, driverId: otherDriver.id }),
    ).toThrow(NotFoundException);
    expect(usage.endDate).toBeNull();
  });

  it('requires existing car and driver records to start a usage', () => {
    expect(() =>
      service.create({
        carId: 'missing-car',
        driverId: createDriver().id,
        reason: 'Business trip',
      }),
    ).toThrow(NotFoundException);

    expect(() =>
      service.create({
        carId: createCar().id,
        driverId: 'missing-driver',
        reason: 'Business trip',
      }),
    ).toThrow(NotFoundException);
  });
});
