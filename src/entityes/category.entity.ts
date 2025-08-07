import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./base";

@Entity('categories')
export class Category extends Base {
    @Column()
    name: string

    @Column({ nullable: true })
    description?: string

    @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: 'SET NULL' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];
}