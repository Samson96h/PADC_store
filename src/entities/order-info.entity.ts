import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./base";
import { Order } from "./order.entity";
import { Product } from "./product.entity";

@Entity('order_info')
export class OrderInfo extends Base {
  @ManyToOne(() => Order, (order) => order.orderInfos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderInfos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  quantity: number;
}