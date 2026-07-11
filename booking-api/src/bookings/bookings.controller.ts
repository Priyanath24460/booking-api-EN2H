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
  Request,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { QueryBookingDto } from './dto/query-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // POST /bookings
  @Post()
  create(
    @Request() req,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.create(req.user.userId, createBookingDto);
  }

  // GET /bookings?status=pending
  @Get()
  findAll(
    @Request() req,
    @Query() queryDto: QueryBookingDto,
  ) {
    return this.bookingsService.findAll(req.user.userId, queryDto);
  }

  // GET /bookings/:id
  @Get(':id')
  findOne(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingsService.findOne(id, req.user.userId);
  }

  // PATCH /bookings/:id/status
  @Patch(':id/status')
  updateStatus(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, req.user.userId, updateStatusDto);
  }

  // DELETE /bookings/:id
  @Delete(':id')
  remove(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingsService.remove(id, req.user.userId);
  }
}
