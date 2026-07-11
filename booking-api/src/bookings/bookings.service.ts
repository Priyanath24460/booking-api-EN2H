import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { ServicesService } from '../services/services.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    private readonly servicesService: ServicesService,
  ) {}

  // POST /bookings — Create a booking
  async create(
    userId: number,
    createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    const { serviceId, bookingDate, notes } = createBookingDto;

    // Verify the service exists and is active
    const service = await this.servicesService.findOne(serviceId);

    if (!service.isActive) {
      throw new BadRequestException('This service is not available');
    }

    const booking = this.bookingRepository.create({
      userId,
      serviceId,
      bookingDate: new Date(bookingDate),
      notes,
    });

    return this.bookingRepository.save(booking);
  }

  // GET /bookings — Get all bookings for logged-in user
  async findAll(
    userId: number,
    queryDto: QueryBookingDto,
  ): Promise<Booking[]> {
    const where: any = { userId };

    if (queryDto.status) {
      where.status = queryDto.status;
    }

    return this.bookingRepository.find({
      where,
      order: { bookingDate: 'ASC' },
    });
  }

  // GET /bookings/:id — Get single booking
  async findOne(id: number, userId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id, userId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  // PATCH /bookings/:id/status — Update booking status
  async updateStatus(
    id: number,
    userId: number,
    updateStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id, userId);

    booking.status = updateStatusDto.status;

    return this.bookingRepository.save(booking);
  }

  // DELETE /bookings/:id — Cancel / delete booking
  async remove(id: number, userId: number): Promise<void> {
    const booking = await this.findOne(id, userId);

    await this.bookingRepository.remove(booking);
  }
}
