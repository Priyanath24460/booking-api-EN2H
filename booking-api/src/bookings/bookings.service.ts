import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Booking } from './entities/booking.entity';
import { BookingStatus } from './entities/booking-status.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { ServicesService } from '../services/services.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    private readonly servicesService: ServicesService,
  ) {}

  // POST /bookings — PUBLIC: anyone can create a booking
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      bookingDate,
      bookingTime,
      notes,
    } = createBookingDto;

    // --- Business Rule 1: Booking date cannot be in the past ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestedDate = new Date(bookingDate);
    requestedDate.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    // --- Verify the service exists and is active ---
    const service = await this.servicesService.findOne(serviceId);

    if (!service.isActive) {
      throw new BadRequestException('This service is not currently available');
    }

    // --- Business Rule 2: Prevent duplicate bookings (same service, date, time) ---
    const duplicate = await this.bookingRepository.findOne({
      where: { serviceId, bookingDate, bookingTime },
    });

    if (duplicate) {
      throw new BadRequestException(
        'This time slot is already booked for the selected service',
      );
    }

    const booking = this.bookingRepository.create({
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      bookingDate,
      bookingTime,
      notes,
    });

    return this.bookingRepository.save(booking);
  }

  // GET /bookings — PROTECTED: admin sees all bookings with optional filter + pagination
  async findAll(
    queryDto: QueryBookingDto,
    paginationDto: PaginationDto,
  ): Promise<{
    data: Booking[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (queryDto.status) {
      where.status = queryDto.status;
    }

    const [data, total] = await this.bookingRepository.findAndCount({
      where,
      order: { bookingDate: 'ASC', bookingTime: 'ASC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // GET /bookings/:id — PROTECTED
  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  // PATCH /bookings/:id/status — PROTECTED
  async updateStatus(
    id: number,
    updateStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    // Business Rule 3: Cancelled → Completed not allowed
    if (
      booking.status === BookingStatus.CANCELLED &&
      updateStatusDto.status === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'A cancelled booking cannot be marked as completed',
      );
    }

    // Business Rule 4: Completed → Cancelled not allowed
    if (
      booking.status === BookingStatus.COMPLETED &&
      updateStatusDto.status === BookingStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'A completed booking cannot be cancelled',
      );
    }

    booking.status = updateStatusDto.status;
    return this.bookingRepository.save(booking);
  }

  // DELETE /bookings/:id — PROTECTED
  async remove(id: number): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }
}
