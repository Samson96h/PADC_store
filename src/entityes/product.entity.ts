import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Base } from './base';

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
}