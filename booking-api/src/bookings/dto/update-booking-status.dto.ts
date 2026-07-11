import { IsEnum } from 'class-validator';
import { BookingStatus } from '../entities/booking-status.enum';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
