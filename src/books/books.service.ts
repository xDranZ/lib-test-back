import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    return this.booksRepository.save(this.booksRepository.create(createBookDto));
  }

  findAll() {
    return this.booksRepository.find({ relations: { copies: true } });
  }

  async findOne(id: string) {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: { copies: true },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.booksRepository.preload({ id, ...updateBookDto });
    if (!book) throw new NotFoundException('Book not found');
    return this.booksRepository.save(book);
  }

  async remove(id: string) {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
  }
}
