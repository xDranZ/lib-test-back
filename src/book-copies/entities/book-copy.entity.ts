import { Book } from '../../books/entities/book.entity';
import { BookCopyStatus } from '../../common/enums/book-copy-status.enum';
import { LoanRequest } from '../../loan-requests/entities/loan-request.entity';
import { Loan } from '../../loans/entities/loan.entity';
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

@Entity('book_copies')
export class BookCopy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: BookCopyStatus,
    default: BookCopyStatus.AVAILABLE,
  })
  status: BookCopyStatus;

  @ManyToOne(() => Book, (book) => book.copies, { nullable: false })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_user_id' })
  ownerUser?: User;

  @OneToMany(() => LoanRequest, (loanRequest) => loanRequest.bookCopy)
  loanRequests: LoanRequest[];

  @OneToMany(() => Loan, (loan) => loan.bookCopy)
  loans: Loan[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
