import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { BookCopiesModule } from './book-copies/book-copies.module';
import { LoanRequestsModule } from './loan-requests/loan-requests.module';
import { LoansModule } from './loans/loans.module';
import { PenaltiesModule } from './penalties/penalties.module';
import { PenaltyTypesModule } from './penalty-types/penalty-types.module';
import { StudentFlowModule } from './student-flow/student-flow.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_DATABASE', 'library'),
        autoLoadEntities: true,
        synchronize: false,
        ssl:
          config.get<string>('DB_SSL') === 'true'
            ? {
                rejectUnauthorized:
                  config.get<string>('DB_SSL_REJECT_UNAUTHORIZED') !== 'false',
              }
            : false,
      }),
    }),
    AuthModule,
    UsersModule,
    BooksModule,
    BookCopiesModule,
    LoanRequestsModule,
    LoansModule,
    PenaltyTypesModule,
    PenaltiesModule,
    StudentFlowModule,
  ],
})
export class AppModule {}
