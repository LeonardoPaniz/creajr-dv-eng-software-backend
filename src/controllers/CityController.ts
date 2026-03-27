import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CityRepository } from '../repositories/CityRepository';
import { CreateCityDto } from '../dto/academic/city.dto';

@Controller('cities')
@ApiTags('Cities')
export class CityController {
  constructor(private readonly cityRepository: CityRepository) {}

  @Get()
  @ApiOperation({ summary: 'List all cities' })
  @ApiQuery({ name: 'stateId', required: false, description: 'Filter by state ID' })
  @ApiResponse({ status: 200, description: 'List of cities' })
  async findAll(@Query('stateId') stateId?: string) {
    if (stateId) {
      return this.cityRepository.findByState(stateId);
    }
    return this.cityRepository.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get city by ID' })
  @ApiParam({ name: 'id', type: String, description: 'City ID' })
  @ApiResponse({ status: 200, description: 'City found' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async findById(@Param('id') id: string) {
    return this.cityRepository.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create city' })
  @ApiBody({ type: CreateCityDto })
  @ApiResponse({ status: 201, description: 'City created' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() data: CreateCityDto) {
    return this.cityRepository.create(data);
  }
}
