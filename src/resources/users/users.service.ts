import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<Omit<User, 'password'>[]> {
        const users = await this.userRepository.find();
        return users.map(({ password, ...rest }) => rest);
    }

    async findOne(id: number): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User with such id was not found!');
        const { password, ...safeUser } = user;
        return safeUser;
    }

    async delete(id: number): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0)
            throw new NotFoundException('User with such id was not found!');
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

}