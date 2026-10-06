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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Car } from './car.model.js';
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
  @ApiCreatedResponse({ description: 'The car was created', type: Car })
  @ApiBadRequestResponse({ description: 'The request body is invalid' })
  @ApiConflictResponse({ description: 'A car with this plate already exists' })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'List cars' })
  @ApiQuery({ name: 'color', required: false })
  @ApiQuery({ name: 'brand', required: false })
  @ApiOkResponse({ description: 'List of cars', type: Car, isArray: true })
  findAll(@Query() filters: ListCarsQueryDto) {
    return this.carsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a car by ID' })
  @ApiOkResponse({ description: 'The requested car', type: Car })
  @ApiNotFoundResponse({ description: 'Car not found' })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a car' })
  @ApiOkResponse({ description: 'The updated car', type: Car })
  @ApiBadRequestResponse({ description: 'The request body is invalid' })
  @ApiConflictResponse({ description: 'Another car already has this plate' })
  @ApiNotFoundResponse({ description: 'Car not found' })
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a car' })
  @ApiNoContentResponse({ description: 'The car was deleted' })
  @ApiConflictResponse({ description: 'The car has an active usage' })
  @ApiNotFoundResponse({ description: 'Car not found' })
  remove(@Param('id') id: string) {
    this.carsService.remove(id);
  }
}
