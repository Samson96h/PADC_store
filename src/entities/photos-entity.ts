import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./base";
import { Product } from "./product.entity";
import { Category } from "./category.entity";

@Entity()
export class AllPhotos extends Base {
    @ManyToOne(() => Product, (product) => product.photos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product | null;

    @ManyToOne(() => Category, (category) => category.photos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    category: Category | null;

    @Column()
    photo: string;

}