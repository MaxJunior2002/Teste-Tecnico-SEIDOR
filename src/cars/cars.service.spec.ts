import { ConflictException, NotFoundException } from '@nestjs/common';
import { ActiveUsageRegistry } from '../common/active-usage-registry.js';
import { Car } from './car.model.js';
import { CarsService } from './cars.service.js';

describe('CarsService', () => {
  let service: CarsService;

  beforeEach(() => {
    service = new CarsService(new ActiveUsageRegistry());
  });

  it('creates and retrieves a car with a generated identifier', () => {
    const created = service.create({
      plate: 'ABC-1234',
      color: 'Blue',
      brand: 'Honda',
    });

    expect(created).toBeInstanceOf(Car);
    expect(created.id).toBeDefined();
    expect(service.findOne(created.id)).toEqual(created);
  });

  it('rejects creating a car with a plate that already exists', () => {
    service.create({ plate: 'ABC-1234', color: 'Blue', brand: 'Honda' });

    expect(() =>
      service.create({ plate: ' abc-1234 ', color: 'Red', brand: 'Toyota' }),
    ).toThrow(ConflictException);
  });

  it('filters cars by color and brand without case sensitivity', () => {
    service.create({ plate: 'ABC-1234', color: 'Blue', brand: 'Honda' });
    service.create({ plate: 'DEF-5678', color: 'Red', brand: 'Honda' });

    expect(service.findAll({ color: 'blue', brand: 'honda' })).toHaveLength(1);
    expect(service.findAll({ color: 'green' })).toEqual([]);
  });

  it('updates a car', () => {
    const car = service.create({
      plate: 'ABC-1234',
      color: 'Blue',
      brand: 'Honda',
    });

    const updated = service.update(car.id, {
      plate: 'DEF-5678',
      color: 'Red',
      brand: 'Toyota',
    });

    expect(updated).toBeInstanceOf(Car);
    expect(updated).toEqual({
      id: car.id,
      plate: 'DEF-5678',
      color: 'Red',
      brand: 'Toyota',
    });
  });

  it('rejects updating a car to another car existing plate', () => {
    const firstCar = service.create({
      plate: 'ABC-1234',
      color: 'Blue',
      brand: 'Honda',
    });
    const secondCar = service.create({
      plate: 'DEF-5678',
      color: 'Red',
      brand: 'Toyota',
    });

    expect(() =>
      service.update(secondCar.id, {
        plate: firstCar.plate,
        color: 'Black',
        brand: 'Ford',
      }),
    ).toThrow(ConflictException);
  });

  it('removes a car', () => {
    const car = service.create({
      plate: 'ABC-1234',
      color: 'Blue',
      brand: 'Honda',
    });

    service.remove(car.id);

    expect(() => service.findOne(car.id)).toThrow(NotFoundException);
  });

  it('throws when retrieving, updating, or removing an unknown car', () => {
    expect(() => service.findOne('missing')).toThrow(NotFoundException);
    expect(() =>
      service.update('missing', {
        plate: 'ABC-1234',
        color: 'Blue',
        brand: 'Honda',
      }),
    ).toThrow(NotFoundException);
    expect(() => service.remove('missing')).toThrow(NotFoundException);
  });
});
