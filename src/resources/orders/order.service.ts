import {Injectable,NotFoundException,BadRequestException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { OrderDto } from './dto/order.dto';
import { OrderInfo } from 'src/entities/order-info.entity';

@Injectable()
export class OrdersService {
        constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(OrderInfo)
        private readonly orderInfoRepository: Repository<OrderInfo>
    ) { }

    async create(orderDto: OrderDto, user: User): Promise<Order> {
        let order = await this.orderRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['orderInfos', 'orderInfos.product'],
        });

        if (!order) {
            order = this.orderRepository.create({ user, totalPrice: 0 });
            await this.orderRepository.save(order);
            order.orderInfos = [];
        }

        for (const item of orderDto.items) {
            const product = await this.productRepository.findOne({
                where: { id: item.productId },
            });
            if (!product) {
                throw new NotFoundException(`Product ${item.productId} not found`);
            }

            const existingInfo = order.orderInfos.find(
                info => info.product.id === item.productId
            );

            if (existingInfo) {
                existingInfo.quantity += item.quantity;
                await this.orderInfoRepository.save(existingInfo);
            } else {
                const newInfo = this.orderInfoRepository.create({
                    order,
                    product,
                    quantity: item.quantity,
                });
                await this.orderInfoRepository.save(newInfo);
                order.orderInfos.push(newInfo);
            }
        }

        let totalPrice = 0;
        for (const info of order.orderInfos) {
            const price = Number(info.product.price);
            const quantity = Number(info.quantity);
            if (isNaN(price) || isNaN(quantity)) {
                throw new BadRequestException('Некорректная цена или количество');
            }
            totalPrice += price * quantity;
        }

        order.totalPrice = totalPrice;
        return this.orderRepository.save(order);
    }

    async findAll(): Promise<Order[]> {
        return await this.orderRepository.find({
            relations: ['user'],
        });
    }

    async findByUser(userId: number): Promise<Order[]> {
        return await this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
        });
    }

    async findOne(id: number): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'orderInfos', 'orderInfos.product'],
        });

        if (!order) {
            throw new NotFoundException(`Заказ с ID ${id} не найден`);
        }

        return order;
    }
}