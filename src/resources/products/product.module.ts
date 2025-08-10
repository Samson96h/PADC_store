import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { User } from 'src/entities/user.entity';
import { Order } from 'src/entities/order.entity';
import { Category } from 'src/entities/category.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, User, Order, Category]),
        AuthModule,
        UsersModule
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule { }