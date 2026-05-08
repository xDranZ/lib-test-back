import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCopy } from '../book-copies/entities/book-copy.entity';
import { User } from '../users/entities/user.entity';
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';
import { UpdateLoanRequestDto } from './dto/update-loan-request.dto';
import { LoanRequest } from './entities/loan-request.entity';

@Injectable()
export class LoanRequestsService {
  constructor(
    @InjectRepository(LoanRequest)
    private readonly loanRequestsRepository: Repository<LoanRequest>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(BookCopy)
    private readonly bookCopiesRepository: Repository<BookCopy>,
  ) {}

  async create(createLoanRequestDto: CreateLoanRequestDto) {
    const [requesterUser, bookCopy] = await Promise.all([
      this.usersRepository.findOne({
        where: { id: createLoanRequestDto.requesterUserId },
      }),
      this.bookCopiesRepository.findOne({
        where: { id: createLoanRequestDto.bookCopyId },
      }),
    ]);

    if (!requesterUser) throw new NotFoundException('Requester user not found');
    if (!bookCopy) throw new NotFoundException('Book copy not found');

    return this.loanRequestsRepository.save(
      this.loanRequestsRepository.create({
        status: createLoanRequestDto.status,
        requestMessage: createLoanRequestDto.requestMessage,
        responseMessage: createLoanRequestDto.responseMessage,
        respondedAt: createLoanRequestDto.respondedAt
          ? new Date(createLoanRequestDto.respondedAt)
          : undefined,
        bookCopy,
        requesterUser,
      }),
    );
  }

  findAll() {
    return this.loanRequestsRepository.find({
      relations: { requesterUser: true, bookCopy: { book: true } },
    });
  }

  async findOne(id: string) {
    const loanRequest = await this.loanRequestsRepository.findOne({
      where: { id },
      relations: { requesterUser: true, bookCopy: { book: true } },
    });
    if (!loanRequest) throw new NotFoundException('Loan request not found');
    return loanRequest;
  }

  async update(id: string, updateLoanRequestDto: UpdateLoanRequestDto) {
    const loanRequest = await this.findOne(id);

    if (updateLoanRequestDto.requesterUserId) {
      const requesterUser = await this.usersRepository.findOne({
        where: { id: updateLoanRequestDto.requesterUserId },
      });
      if (!requesterUser) {
        throw new NotFoundException('Requester user not found');
      }
      loanRequest.requesterUser = requesterUser;
    }

    if (updateLoanRequestDto.bookCopyId) {
      const bookCopy = await this.bookCopiesRepository.findOne({
        where: { id: updateLoanRequestDto.bookCopyId },
      });
      if (!bookCopy) throw new NotFoundException('Book copy not found');
      loanRequest.bookCopy = bookCopy;
    }

    Object.assign(loanRequest, {
      status: updateLoanRequestDto.status ?? loanRequest.status,
      requestMessage:
        updateLoanRequestDto.requestMessage ?? loanRequest.requestMessage,
      responseMessage:
        updateLoanRequestDto.responseMessage ?? loanRequest.responseMessage,
      respondedAt: updateLoanRequestDto.respondedAt
        ? new Date(updateLoanRequestDto.respondedAt)
        : loanRequest.respondedAt,
    });

    return this.loanRequestsRepository.save(loanRequest);
  }

  async remove(id: string) {
    const loanRequest = await this.findOne(id);
    await this.loanRequestsRepository.remove(loanRequest);
  }
}
