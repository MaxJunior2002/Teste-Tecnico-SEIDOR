import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateCarDto } from './dto/create-car.dto.js';
import { ListCarsQueryDto } from './dto/list-cars-query.dto.js';
import { UpdateCarDto } from './dto/update-car.dto.js';
import { CarsService } from './cars.service.js';

@Controller('cars')
@ApiTags('cars')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a car' })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'List cars' })
  @ApiQuery({ name: 'color', required: false })
  @ApiQuery({ name: 'brand', required: false })
  findAll(@Query() filters: ListCarsQueryDto) {
    return this.carsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a car by ID' })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a car' })
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a car' })
  remove(@Param('id') id: string) {
    this.carsService.remove(id);
  }
}
