import { Column, Entity, OneToMany } from "typeorm";
import { Base } from "./base";
import { Order } from "./order.entity";

export type UserRole = 'user' | 'manager' | 'admin';

@Entity('users')
export class User extends Base {

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column()
    age: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @Column({ default: 'user' })
    role: UserRole;
}