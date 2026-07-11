import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'Registered email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', description: 'Account password', minLength: 6 })
  @MinLength(6)
  password: string;
}