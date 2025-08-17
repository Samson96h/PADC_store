import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { OrderInfo } from 'src/entities/order-info.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Product, User, OrderInfo]),
        AuthModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule { }