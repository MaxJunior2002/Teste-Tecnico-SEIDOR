import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateCarDto } from './dto/create-car.dto.js';
import { ListCarsQueryDto } from './dto/list-cars-query.dto.js';
import { UpdateCarDto } from './dto/update-car.dto.js';
import { Car } from './car.model.js';

@Injectable()
export class CarsService {
  private readonly cars = new Map<string, Car>();

  create(createCarDto: CreateCarDto): Car {
    this.ensurePlateIsAvailable(createCarDto.plate);

    const car = new Car(
      randomUUID(),
      createCarDto.plate,
      createCarDto.color,
      createCarDto.brand,
    );
    this.cars.set(car.id, car);
    return car;
  }

  findAll(filters: ListCarsQueryDto = {}): Car[] {
    const color = filters.color?.trim().toLowerCase();
    const brand = filters.brand?.trim().toLowerCase();

    return [...this.cars.values()].filter(
      (car) =>
        (!color || car.color.toLowerCase() === color) &&
        (!brand || car.brand.toLowerCase() === brand),
    );
  }

  findOne(id: string): Car {
    const car = this.cars.get(id);
    if (!car) {
      throw new NotFoundException(`Car with ID "${id}" was not found`);
    }
    return car;
  }

  update(id: string, updateCarDto: UpdateCarDto): Car {
    this.findOne(id);
    this.ensurePlateIsAvailable(updateCarDto.plate, id);

    const car = new Car(
      id,
      updateCarDto.plate,
      updateCarDto.color,
      updateCarDto.brand,
    );
    this.cars.set(id, car);
    return car;
  }

  remove(id: string): void {
    this.findOne(id);
    this.cars.delete(id);
  }

  private ensurePlateIsAvailable(plate: string, excludedCarId?: string): void {
    const normalizedPlate = plate.trim().toUpperCase();
    const plateAlreadyExists = [...this.cars.values()].some(
      (car) =>
        car.id !== excludedCarId &&
        car.plate.trim().toUpperCase() === normalizedPlate,
    );

    if (plateAlreadyExists) {
      throw new ConflictException(`Car with plate "${plate}" already exists`);
    }
  }
}
