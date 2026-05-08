import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCopy } from '../book-copies/entities/book-copy.entity';
import { User } from '../users/entities/user.entity';
import { LoanRequest } from './entities/loan-request.entity';
import { LoanRequestsController } from './loan-requests.controller';
import { LoanRequestsService } from './loan-requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoanRequest, User, BookCopy])],
  controllers: [LoanRequestsController],
  providers: [LoanRequestsService],
})
export class LoanRequestsModule {}
