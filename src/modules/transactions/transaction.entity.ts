import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@app/modules/user/user.entity';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  sum: number;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  source: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true })
  user: UserEntity;
}
