import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';


import { Category } from './category.entity';
import { Base } from './base';
import { OrderInfo } from './order-info.entity';
import { AllPhotos } from './photos-entity';

@Entity('products')
export class Product extends Base {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Category, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => OrderInfo, (info) => info.product)
  orderInfos: OrderInfo[];

  @OneToMany(() => AllPhotos, (photo) => photo.product, { cascade: true })
  photos: AllPhotos[];
}