import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Haircut', description: 'Title of the service' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Professional mens haircut', description: 'Full description of the service' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 30, description: 'Duration of the service in minutes', minimum: 1 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 1500, description: 'Price of the service in smallest currency unit', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: true, description: 'Whether the service is currently available for booking' })
  @IsBoolean()
  isActive: boolean;
}