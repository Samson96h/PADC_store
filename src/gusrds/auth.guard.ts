import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entityes/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers['authorization'];

        if (!authorization) {
            throw new UnauthorizedException('Missing authorization header');
        }

        const token = authorization.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Invalid token format');
        }
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersRepository.findOne({
                where: { id: payload.sub },
            });

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            request.user = user;
            return true;
        } catch (error) {
            console.error('JWT Error:', error);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}