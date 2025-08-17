import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from '../auth/auth.module';
import { User } from 'src/entities/user.entity';
import { AllPhotos } from 'src/entities/photos-entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category, User, AllPhotos]),
        AuthModule],
    providers: [CategoryService],
    controllers: [CategoryController],
})
export class CategoryModule { }