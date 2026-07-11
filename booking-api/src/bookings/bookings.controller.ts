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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // ✅ PUBLIC — no JWT required
  @Post()
  @ApiOperation({
    summary: 'Create a new booking (Public — no login required)',
    description:
      'Any customer can submit a booking. Validates service availability, prevents past dates, and blocks duplicate time slots.',
  })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error / duplicate slot / past date / inactive service' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  // 🔐 PROTECTED — JWT required below
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all bookings with optional status filter and pagination (Admin)' })
  @ApiResponse({ status: 200, description: 'Paginated list of bookings' })
  @ApiResponse({ status: 401, description: 'Unauthorized — JWT required' })
  findAll(
    @Query() queryDto: QueryBookingDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.bookingsService.findAll(queryDto, paginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a single booking by ID (Admin)' })
  @ApiParam({ name: 'id', type: Number, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking found' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update booking status (Admin)',
    description:
      'Allowed transitions: pending→confirmed, pending→cancelled, confirmed→completed. Cancelled bookings cannot be completed.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking status updated' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a booking by ID (Admin)' })
  @ApiParam({ name: 'id', type: Number, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.remove(id);
  }
}
