import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookCopyDto } from './dto/create-book-copy.dto';
import { UpdateBookCopyDto } from './dto/update-book-copy.dto';
import { BookCopy } from './entities/book-copy.entity';

@Injectable()
export class BookCopiesService {
  constructor(
    @InjectRepository(BookCopy)
    private readonly bookCopiesRepository: Repository<BookCopy>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createBookCopyDto: CreateBookCopyDto) {
    const book = await this.booksRepository.findOne({
      where: { id: createBookCopyDto.bookId },
    });
    if (!book) throw new NotFoundException('Book not found');

    const ownerUser = createBookCopyDto.ownerUserId
      ? await this.usersRepository.findOne({
          where: { id: createBookCopyDto.ownerUserId },
        })
      : undefined;
    if (createBookCopyDto.ownerUserId && !ownerUser) {
      throw new NotFoundException('Owner user not found');
    }

    const bookCopy = this.bookCopiesRepository.create({
      status: createBookCopyDto.status,
      book,
      ownerUser: ownerUser ?? undefined,
    });

    return this.bookCopiesRepository.save(bookCopy);
  }

  findAll() {
    return this.bookCopiesRepository.find({
      relations: { book: true, ownerUser: true },
    });
  }

  async findOne(id: string) {
    const bookCopy = await this.bookCopiesRepository.findOne({
      where: { id },
      relations: { book: true, ownerUser: true },
    });
    if (!bookCopy) throw new NotFoundException('Book copy not found');
    return bookCopy;
  }

  async update(id: string, updateBookCopyDto: UpdateBookCopyDto) {
    const bookCopy = await this.findOne(id);

    if (updateBookCopyDto.bookId) {
      const book = await this.booksRepository.findOne({
        where: { id: updateBookCopyDto.bookId },
      });
      if (!book) throw new NotFoundException('Book not found');
      bookCopy.book = book;
    }

    if (updateBookCopyDto.ownerUserId) {
      const ownerUser = await this.usersRepository.findOne({
        where: { id: updateBookCopyDto.ownerUserId },
      });
      if (!ownerUser) throw new NotFoundException('Owner user not found');
      bookCopy.ownerUser = ownerUser;
    }

    Object.assign(bookCopy, {
      status: updateBookCopyDto.status ?? bookCopy.status,
    });

    return this.bookCopiesRepository.save(bookCopy);
  }

  async remove(id: string) {
    const bookCopy = await this.findOne(id);
    await this.bookCopiesRepository.remove(bookCopy);
  }
}
