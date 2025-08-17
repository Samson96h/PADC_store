// auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { SecretCode } from 'src/entities/secret.entiy';
import { CodeCheckingDTO } from './dto/code-checking.dto';
import { NewPasswordDTO } from './dto/new-password.dto';
import { AuthRequest } from 'src/main';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(SecretCode)
        private readonly secretRepository: Repository<SecretCode>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDTO , file?: Express.Multer.File): Promise<{ access_token: string }> {
        const existing = await this.userRepository.findOne({ where: { email: registerDto.email } });
        if (existing) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 12);

        const newUser = this.userRepository.create({
            ...registerDto,
            password: hashedPassword,
        });
        const savedUser = await this.userRepository.save(newUser);

        const payload = { sub: savedUser.id, email: savedUser.email };
        return {
            access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
        };
    }

    async login(loginDto: LoginDTO): Promise<{ access_token: string }> {
        const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Wrong password');
        }

        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
        };
    }

    async forgetPassword(forgetPasswordDto: ForgetPasswordDTO): Promise<{ access_token: string; code: number }> {
        const user = await this.userRepository.findOne({ where: { email: forgetPasswordDto.email } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        await this.secretRepository.delete({ user: { id: user.id } });

        const random_nums = Math.floor(100000 + Math.random() * 900000);

        const secretCode = this.secretRepository.create({
            code: random_nums.toString(),
            user,
        });

        await this.secretRepository.save(secretCode);

        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
            code: random_nums,
        };
    }

    async codeChecking(codeCheckingDto: CodeCheckingDTO, req: AuthRequest): Promise<{ message: string }> {
        const user = req.user;

        const secret = await this.secretRepository.findOne({
            where: {
                code: codeCheckingDto.secretCode, user: { id: user.id },
            },
        });

        if (!secret) {
            throw new UnauthorizedException('Code is not found or does not belong to this user');
        }

        secret.check = 'true';
        await this.secretRepository.save(secret);

        return { message: 'Code verified successfully' };
    }

    async newPassword(dto: NewPasswordDTO, req: AuthRequest): Promise<{ message: string }> {
        const user = req.user;

        const secret = await this.secretRepository.findOne({
            where: { user: { id: user.id }, check: 'true' },
        });

        if (!secret) {
            throw new UnauthorizedException('Code not verified');
        }

        user.password = await bcrypt.hash(dto.newPassword, 10);
        await this.userRepository.save(user);
        await this.secretRepository.delete({ id: secret.id });

        return { message: 'Password reset successfully' };
    }
}