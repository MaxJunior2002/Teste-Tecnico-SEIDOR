import { NotFoundException } from '@nestjs/common';
import { ActiveUsageRegistry } from '../common/active-usage-registry.js';
import { Driver } from './driver.model.js';
import { DriversService } from './drivers.service.js';

describe('DriversService', () => {
  let service: DriversService;

  beforeEach(() => {
    service = new DriversService(new ActiveUsageRegistry());
  });

  it('creates and retrieves a driver with a generated identifier', () => {
    const created = service.create({ name: 'Maria Silva' });

    expect(created).toBeInstanceOf(Driver);
    expect(created.id).toBeDefined();
    expect(service.findOne(created.id)).toEqual(created);
  });

  it('filters drivers by a case-insensitive partial name', () => {
    service.create({ name: 'Maria Silva' });
    service.create({ name: 'Joao Santos' });

    expect(service.findAll({ name: 'maria' })).toHaveLength(1);
    expect(service.findAll({ name: 'silv' })).toHaveLength(1);
    expect(service.findAll({ name: 'unknown' })).toEqual([]);
  });

  it('updates a driver', () => {
    const driver = service.create({ name: 'Maria Silva' });

    const updated = service.update(driver.id, { name: 'Maria Souza' });

    expect(updated).toBeInstanceOf(Driver);
    expect(updated).toEqual({ id: driver.id, name: 'Maria Souza' });
  });

  it('removes a driver', () => {
    const driver = service.create({ name: 'Maria Silva' });

    service.remove(driver.id);

    expect(() => service.findOne(driver.id)).toThrow(NotFoundException);
  });

  it('throws when retrieving, updating, or removing an unknown driver', () => {
    expect(() => service.findOne('missing')).toThrow(NotFoundException);
    expect(() => service.update('missing', { name: 'Maria Silva' })).toThrow(
      NotFoundException,
    );
    expect(() => service.remove('missing')).toThrow(NotFoundException);
  });
});
