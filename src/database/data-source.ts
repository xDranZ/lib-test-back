import 'dotenv/config';
import { DataSource } from 'typeorm';
import { BookCopy } from '../book-copies/entities/book-copy.entity';
import { Book } from '../books/entities/book.entity';
import { LoanRequest } from '../loan-requests/entities/loan-request.entity';
import { Loan } from '../loans/entities/loan.entity';
import { PenaltyType } from '../penalty-types/entities/penalty-type.entity';
import { Penalty } from '../penalties/entities/penalty.entity';
import { User } from '../users/entities/user.entity';

const sslEnabled = process.env.DB_SSL === 'true';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'library',
  entities: [User, Book, BookCopy, LoanRequest, Loan, PenaltyType, Penalty],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  synchronize: false,
  ssl: sslEnabled
    ? {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      }
    : false,
});
