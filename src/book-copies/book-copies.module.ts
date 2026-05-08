import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { BookCopiesController } from './book-copies.controller';
import { BookCopiesService } from './book-copies.service';
import { BookCopy } from './entities/book-copy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookCopy, Book, User])],
  controllers: [BookCopiesController],
  providers: [BookCopiesService],
})
export class BookCopiesModule {}
