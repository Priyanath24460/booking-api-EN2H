import { IsNumber, IsDateString, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  @Min(1)
  serviceId: number;

  @IsDateString()
  bookingDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
