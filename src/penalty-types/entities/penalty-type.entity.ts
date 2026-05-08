import { Penalty } from '../../penalties/entities/penalty.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('penalty_types')
export class PenaltyType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  defaultAmount: string;

  @OneToMany(() => Penalty, (penalty) => penalty.penaltyType)
  penalties: Penalty[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
