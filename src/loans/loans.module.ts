import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCopy } from '../book-copies/entities/book-copy.entity';
import { LoanRequest } from '../loan-requests/entities/loan-request.entity';
import { Penalty } from '../penalties/entities/penalty.entity';
import { User } from '../users/entities/user.entity';
import { Loan } from './entities/loan.entity';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan, User, BookCopy, LoanRequest, Penalty]),
  ],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
