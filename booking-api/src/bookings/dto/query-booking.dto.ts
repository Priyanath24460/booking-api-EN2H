import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { BookingStatus } from '../entities/booking-status.enum';

export class QueryBookingDto {
  @ApiPropertyOptional({
    enum: BookingStatus,
    example: BookingStatus.PENDING,
    description: 'Filter bookings by status',
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
