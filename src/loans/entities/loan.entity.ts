import { BookCopy } from '../../book-copies/entities/book-copy.entity';
import { LoanStatus } from '../../common/enums/loan-status.enum';
import { LoanRequest } from '../../loan-requests/entities/loan-request.entity';
import { Penalty } from '../../penalties/entities/penalty.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'delivery_code_hash' })
  deliveryCodeHash: string;

  @Column({ name: 'delivery_confirmed_at', type: 'timestamp', nullable: true })
  deliveryConfirmedAt?: Date;

  @Column({ name: 'return_code_hash', nullable: true })
  returnCodeHash?: string;

  @Column({ name: 'return_confirmed_at', type: 'timestamp', nullable: true })
  returnConfirmedAt?: Date;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: string;

  @Column({ name: 'returned_at', type: 'timestamp', nullable: true })
  returnedAt?: string;

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.ACTIVE,
  })
  status: LoanStatus;

  @ManyToOne(() => BookCopy, (bookCopy) => bookCopy.loans, {
    nullable: false,
  })
  @JoinColumn({ name: 'book_copy_id' })
  bookCopy: BookCopy;

  @ManyToOne(() => User, (user) => user.loans, { nullable: false })
  @JoinColumn({ name: 'borrower_user_id' })
  borrowerUser: User;

  @ManyToOne(() => LoanRequest, { nullable: true })
  @JoinColumn({ name: 'loan_request_id' })
  loanRequest?: LoanRequest;

  @ManyToOne(() => Penalty, (penalty) => penalty.loans, { nullable: true })
  @JoinColumn({ name: 'penalty_id' })
  penalty?: Penalty;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
