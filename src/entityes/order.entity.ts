import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Base } from './base';

@Entity('orders')
export class Order extends Base {

    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'jsonb', nullable: true })
    items: {
        productId: number;
        price: number;
        quantity: number;
    }[];
}