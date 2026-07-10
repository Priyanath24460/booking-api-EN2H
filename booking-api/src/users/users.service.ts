import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(user: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(user);

        return await this.userRepository.save(newUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                email,
            },
        });
    }

    async findById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                id,
            },
        });
    }
}