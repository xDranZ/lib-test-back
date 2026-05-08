import { BookCopy } from '../../book-copies/entities/book-copy.entity';
import { LoanRequestStatus } from '../../common/enums/loan-request-status.enum';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('loan_requests')
export class LoanRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LoanRequestStatus,
    default: LoanRequestStatus.PENDING,
  })
  status: LoanRequestStatus;

  @Column({ name: 'request_message', type: 'text' })
  requestMessage: string;

  @Column({ name: 'response_message', type: 'text', nullable: true })
  responseMessage?: string;

  @CreateDateColumn({ name: 'requested_at' })
  requestedAt: Date;

  @Column({ name: 'responded_at', type: 'timestamp', nullable: true })
  respondedAt?: Date;

  @ManyToOne(() => BookCopy, (bookCopy) => bookCopy.loanRequests, {
    nullable: false,
  })
  @JoinColumn({ name: 'book_copy_id' })
  bookCopy: BookCopy;

  @ManyToOne(() => User, (user) => user.loanRequests, { nullable: false })
  @JoinColumn({ name: 'requester_user_id' })
  requesterUser: User;
}
