import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  create(@Body() createCarUsageDto: CreateCarUsageDto) {
    return this.usagesService.create(createCarUsageDto);
  }

  @Get()
  @ApiOperation({ summary: 'List car usage records' })
  findAll() {
    return this.usagesService.findAll();
  }

  @Post('end')
  @ApiOperation({ summary: 'Finish using a car by its driver' })
  finish(@Body() finishCarUsageDto: FinishCarUsageDto) {
    return this.usagesService.finish(finishCarUsageDto);
  }
}
