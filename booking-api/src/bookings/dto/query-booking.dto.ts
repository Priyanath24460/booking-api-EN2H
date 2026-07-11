import { IsOptional, IsEnum } from 'class-validator';
import { BookingStatus } from '../entities/booking-status.enum';

export class QueryBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
