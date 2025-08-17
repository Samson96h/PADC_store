import { Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import { User } from './user.entity';
import { Base } from './base';
import { OrderInfo } from './order-info.entity';

@Entity('orders')
export class Order extends Base {
    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => OrderInfo, (info) => info.order, { cascade: true })
    orderInfos: OrderInfo[];
    @Column({name:'total_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalPrice: number;

}