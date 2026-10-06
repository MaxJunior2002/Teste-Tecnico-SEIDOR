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
import { Driver } from './driver.model.js';
import { CreateDriverDto } from './dto/create-driver.dto.js';
import { ListDriversQueryDto } from './dto/list-drivers-query.dto.js';
import { UpdateDriverDto } from './dto/update-driver.dto.js';
import { DriversService } from './drivers.service.js';

@Controller('drivers')
@ApiTags('drivers')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @ApiOperation({ summary: 'Create a driver' })
  @ApiCreatedResponse({ description: 'The driver was created', type: Driver })
  @ApiBadRequestResponse({ description: 'The request body is invalid' })
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @ApiOperation({ summary: 'List drivers' })
  @ApiQuery({ name: 'name', required: false })
  @ApiOkResponse({
    description: 'List of drivers',
    type: Driver,
    isArray: true,
  })
  findAll(@Query() filters: ListDriversQueryDto) {
    return this.driversService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a driver by ID' })
  @ApiOkResponse({ description: 'The requested driver', type: Driver })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a driver' })
  @ApiOkResponse({ description: 'The updated driver', type: Driver })
  @ApiBadRequestResponse({ description: 'The request body is invalid' })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a driver' })
  @ApiNoContentResponse({ description: 'The driver was deleted' })
  @ApiConflictResponse({ description: 'The driver has an active usage' })
  @ApiNotFoundResponse({ description: 'Driver not found' })
  remove(@Param('id') id: string) {
    this.driversService.remove(id);
  }
}
