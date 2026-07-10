import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    async register(registerDto: RegisterDto) {
        return {
            message: 'Register endpoint is working',
            data: registerDto,
        };
    }
}