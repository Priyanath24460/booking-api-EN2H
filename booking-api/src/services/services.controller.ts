import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Services')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service (Admin only)' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized — JWT required' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of services' })
  @ApiResponse({ status: 401, description: 'Unauthorized — JWT required' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.servicesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single service by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service found' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }
}