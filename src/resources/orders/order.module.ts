import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { Order } from 'src/entityes/order.entity';
import { Product } from 'src/entityes/product.entity';
import { User } from 'src/entityes/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Product, User]),
        AuthModule
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule { }