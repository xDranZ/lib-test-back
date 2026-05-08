import { LoanRequest } from '../../loan-requests/entities/loan-request.entity';
import { Loan } from '../../loans/entities/loan.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @OneToMany(() => LoanRequest, (loanRequest) => loanRequest.requesterUser)
  loanRequests: LoanRequest[];

  @OneToMany(() => Loan, (loan) => loan.borrowerUser)
  loans: Loan[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
