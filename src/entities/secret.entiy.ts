import { Entity,Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Base } from './base';

@Entity()
export class SecretCode extends Base{
  @Column()
  code: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: 'false' })
  check: string;

}