import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entityes/user.entity';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ForgetPasswordDTO } from './dto/forget_password.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDTO): Promise<{ access_token: string }> {
        const existing = await this.userRepository.findOne({ where: { email: registerDto.email } });
        if (existing) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 12);
        const newUser = this.userRepository.create({ ...registerDto, password: hashedPassword });
        const savedUser = await this.userRepository.save(newUser);

        const payload = { sub: savedUser.id, email: savedUser.email };
        const access_token = this.jwtService.sign(payload);

        return { access_token };
    }

    async login(loginDto: LoginDTO): Promise<{ access_token: string }> {
        const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('wrong password');
        }

        const payload = { sub: user.id, email: user.email };
        return { access_token: this.jwtService.sign(payload) };
    }

    async forget_password(forgetPasswordDto: ForgetPasswordDTO): Promise<{ access_token: string }> {
        const user = await this.userRepository.findOne({ where: { email: forgetPasswordDto.email } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        if (forgetPasswordDto.firstName !== user.firstName) {
            throw new UnauthorizedException('Invalid identity confirmation');
        }

        const hashedPassword = await bcrypt.hash(forgetPasswordDto.newPassword, 10);
        user.password = hashedPassword;

        await this.userRepository.save(user);

        const payload = { sub: user.id, email: user.email };
        return { access_token: this.jwtService.sign(payload) };
    }
}