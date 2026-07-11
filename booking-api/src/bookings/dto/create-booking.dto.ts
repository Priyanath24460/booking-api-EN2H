import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsOptional,
  Min,
  Matches,
  IsISO8601,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'Jane Smith', description: 'Full name of the customer' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'jane@example.com', description: 'Customer email address' })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({ example: '+94771234567', description: 'Customer phone number (7–15 digits, optional +)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'customerPhone must be a valid phone number',
  })
  customerPhone: string;

  @ApiProperty({ example: 1, description: 'ID of the service to book', minimum: 1 })
  @IsNumber()
  @Min(1)
  serviceId: number;

  @ApiProperty({ example: '2026-08-15', description: 'Booking date in YYYY-MM-DD format (cannot be in the past)' })
  @IsISO8601({ strict: false })
  @IsNotEmpty()
  bookingDate: string;

  @ApiProperty({ example: '10:00', description: 'Booking time in HH:mm 24-hour format' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'bookingTime must be in HH:mm format (e.g. "10:00")',
  })
  bookingTime: string;

  @ApiPropertyOptional({ example: 'Please use fragrance-free products', description: 'Optional notes for the booking' })
  @IsOptional()
  @IsString()
  notes?: string;
}
