import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('properties')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  @ApiResponse({ status: 200, description: 'List of all properties' })
  async findAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  @ApiResponse({ status: 200, description: 'Property details' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async findOne(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);
    if (!property) {
      return { statusCode: 404, message: 'Property not found' };
    }
    return property;
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create new property (Admin only)' })
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update property (Admin only)' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  @ApiBody({ type: UpdatePropertyDto })
  @ApiResponse({ status: 200, description: 'Property updated successfully' })
  async update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete property (Admin only)' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async remove(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);
    if (!property) {
      return { statusCode: 404, message: 'Property not found' };
    }
    await this.propertiesService.remove(id);
    return { message: 'Property deleted successfully' };
  }
}
