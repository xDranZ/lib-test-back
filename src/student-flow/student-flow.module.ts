import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCopy } from '../book-copies/entities/book-copy.entity';
import { Book } from '../books/entities/book.entity';
import { LoanRequest } from '../loan-requests/entities/loan-request.entity';
import { Loan } from '../loans/entities/loan.entity';
import { Penalty } from '../penalties/entities/penalty.entity';
import { User } from '../users/entities/user.entity';
import { StudentFlowController } from './student-flow.controller';
import { StudentFlowService } from './student-flow.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Book,
      BookCopy,
      LoanRequest,
      Loan,
      Penalty,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d') as any,
        },
      }),
    }),
  ],
  controllers: [StudentFlowController],
  providers: [StudentFlowService],
})
export class StudentFlowModule {}
