import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CarUsage } from './car-usage.model.js';
import { CreateCarUsageDto } from './dto/create-car-usage.dto.js';
import { FinishCarUsageDto } from './dto/finish-car-usage.dto.js';
import { UsagesService } from './usages.service.js';

@Controller('usages')
@ApiTags('car usages')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UsagesController {
  constructor(private readonly usagesService: UsagesService) {}

  @Post()
  @ApiOperation({ summary: 'Start using a car' })
  @ApiCreatedResponse({
    description: 'The car usage was started',
    type: CarUsage,
  })
  @ApiBadRequestResponse({ description: 'The request body is invalid' })
  @ApiConflictResponse({
    description: 'The car or driver already has an active usage',
  })
  @ApiNotFoundResponse({ description: 'Car or driver not found' })
  create(@Body() createCarUsageDto: CreateCarUsageDto) {
    return this.usagesService.create(createCarUsageDto);
  }

  @Get()
  @ApiOperation({ summary: 'List car usage records' })
  @ApiOkResponse({
    description: 'List of usage records, including car and driver details',
    type: CarUsage,
    isArray: true,
  })
  findAll() {
    return this.usagesService.findAll();
  }

  @Post('end')
  @ApiOperation({ summary: 'Finish using a car by its driver' })
  @ApiOkResponse({
    description: 'The usage was finished and its end date recorded',
    type: CarUsage,
  })
  @ApiBadRequestResponse({ description: 'The request body is invalid' })
  @ApiNotFoundResponse({
    description: 'Car, driver, or active usage not found',
  })
  finish(@Body() finishCarUsageDto: FinishCarUsageDto) {
    return this.usagesService.finish(finishCarUsageDto);
  }
}
