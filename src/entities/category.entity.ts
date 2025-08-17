import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./base";
import { AllPhotos } from "./photos-entity";

@Entity('categories')
export class Category extends Base {
    @Column()
    name: string

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => Category, category => category.children, { nullable: true })
    @JoinColumn({ name: 'parentId' })
    parent: Category | null;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @OneToMany(() => AllPhotos, (photo) => photo.category, { cascade: true })
    photos: AllPhotos[];
}