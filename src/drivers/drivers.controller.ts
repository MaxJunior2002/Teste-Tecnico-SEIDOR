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
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @ApiOperation({ summary: 'List drivers' })
  @ApiQuery({ name: 'name', required: false })
  findAll(@Query() filters: ListDriversQueryDto) {
    return this.driversService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a driver by ID' })
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a driver' })
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a driver' })
  remove(@Param('id') id: string) {
    this.driversService.remove(id);
  }
}
