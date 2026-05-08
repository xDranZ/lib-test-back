import { Loan } from '../../loans/entities/loan.entity';
import { PenaltyType } from '../../penalty-types/entities/penalty-type.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('penalties')
export class Penalty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt?: Date;

  @Column({ type: 'text' })
  reason: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PenaltyType, (penaltyType) => penaltyType.penalties, {
    nullable: false,
  })
  @JoinColumn({ name: 'penalty_type_id' })
  penaltyType: PenaltyType;

  @OneToMany(() => Loan, (loan) => loan.penalty)
  loans: Loan[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
