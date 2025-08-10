import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
    findOne(id: number) {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async create(dto: OrderDto, userId: number): Promise<Order> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const items = await Promise.all(dto.items.map(async ({ productId, quantity }) => {
            const product = await this.productRepository.findOne({ where: { id: productId } });
            if (!product) throw new NotFoundException(`Product with ID ${productId} not found`);

            const unitPrice = Number(product.price);
            return {
                productId,
                unitPrice,
                quantity,
                totalPrice: unitPrice * quantity
            };
        }));

        if (!items.length) throw new BadRequestException('Order must contain at least one item');

        const order = this.orderRepository.create({ user, items });
        return await this.orderRepository.save(order);
    }

    async findAll(): Promise<Order[]> {
        return await this.orderRepository.find({
            relations: ['user']
        });
    }

    async findByUser(userId: number): Promise<Order[]> {
        return await this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['user']
        });
    }
}