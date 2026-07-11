import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BookingStatus } from '../entities/booking-status.enum';

export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: 'New status for the booking. Cannot mark a cancelled booking as completed.',
  })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
