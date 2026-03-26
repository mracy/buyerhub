import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('properties')
@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  async findAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  async findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create new property' })
  async create(@Body() createPropertyDto: any) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update property' })
  async update(@Param('id') id: string, @Body() updatePropertyDto: any) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete property' })
  async remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}
