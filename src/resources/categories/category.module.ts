import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entityes/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from '../auth/auth.module';
import { User } from 'src/entityes/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category, User]),
        AuthModule],
    providers: [CategoryService],
    controllers: [CategoryController],
})
export class CategoryModule { }