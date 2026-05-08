import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCopy } from '../book-copies/entities/book-copy.entity';
import { LoanRequest } from '../loan-requests/entities/loan-request.entity';
import { Penalty } from '../penalties/entities/penalty.entity';
import { User } from '../users/entities/user.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Loan } from './entities/loan.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loansRepository: Repository<Loan>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(BookCopy)
    private readonly bookCopiesRepository: Repository<BookCopy>,
    @InjectRepository(LoanRequest)
    private readonly loanRequestsRepository: Repository<LoanRequest>,
    @InjectRepository(Penalty)
    private readonly penaltiesRepository: Repository<Penalty>,
  ) {}

  async create(createLoanDto: CreateLoanDto) {
    const [borrowerUser, bookCopy, loanRequest, penalty] = await Promise.all([
      this.usersRepository.findOne({
        where: { id: createLoanDto.borrowerUserId },
      }),
      this.bookCopiesRepository.findOne({
        where: { id: createLoanDto.bookCopyId },
      }),
      createLoanDto.loanRequestId
        ? this.loanRequestsRepository.findOne({
            where: { id: createLoanDto.loanRequestId },
          })
        : Promise.resolve(null),
      createLoanDto.penaltyId
        ? this.penaltiesRepository.findOne({
            where: { id: createLoanDto.penaltyId },
          })
        : Promise.resolve(null),
    ]);

    if (!borrowerUser) throw new NotFoundException('Borrower user not found');
    if (!bookCopy) throw new NotFoundException('Book copy not found');
    if (createLoanDto.loanRequestId && !loanRequest) {
      throw new NotFoundException('Loan request not found');
    }
    if (createLoanDto.penaltyId && !penalty) {
      throw new NotFoundException('Penalty not found');
    }

    return this.loansRepository.save(
      this.loansRepository.create({
        deliveryCodeHash: createLoanDto.deliveryCodeHash,
        deliveryConfirmedAt: createLoanDto.deliveryConfirmedAt
          ? new Date(createLoanDto.deliveryConfirmedAt)
          : undefined,
        returnCodeHash: createLoanDto.returnCodeHash,
        returnConfirmedAt: createLoanDto.returnConfirmedAt
          ? new Date(createLoanDto.returnConfirmedAt)
          : undefined,
        dueDate: createLoanDto.dueDate,
        returnedAt: createLoanDto.returnedAt,
        status: createLoanDto.status,
        bookCopy,
        borrowerUser,
        loanRequest: loanRequest ?? undefined,
        penalty: penalty ?? undefined,
      }),
    );
  }

  findAll() {
    return this.loansRepository.find({
      relations: {
        borrowerUser: true,
        bookCopy: { book: true },
        loanRequest: true,
        penalty: true,
      },
    });
  }

  async findOne(id: string) {
    const loan = await this.loansRepository.findOne({
      where: { id },
      relations: {
        borrowerUser: true,
        bookCopy: { book: true },
        loanRequest: true,
        penalty: true,
      },
    });
    if (!loan) throw new NotFoundException('Loan not found');
    return loan;
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    const loan = await this.findOne(id);

    if (updateLoanDto.borrowerUserId) {
      const borrowerUser = await this.usersRepository.findOne({
        where: { id: updateLoanDto.borrowerUserId },
      });
      if (!borrowerUser) throw new NotFoundException('Borrower user not found');
      loan.borrowerUser = borrowerUser;
    }

    if (updateLoanDto.bookCopyId) {
      const bookCopy = await this.bookCopiesRepository.findOne({
        where: { id: updateLoanDto.bookCopyId },
      });
      if (!bookCopy) throw new NotFoundException('Book copy not found');
      loan.bookCopy = bookCopy;
    }

    if (updateLoanDto.loanRequestId) {
      const loanRequest = await this.loanRequestsRepository.findOne({
        where: { id: updateLoanDto.loanRequestId },
      });
      if (!loanRequest) throw new NotFoundException('Loan request not found');
      loan.loanRequest = loanRequest;
    }

    if (updateLoanDto.penaltyId) {
      const penalty = await this.penaltiesRepository.findOne({
        where: { id: updateLoanDto.penaltyId },
      });
      if (!penalty) throw new NotFoundException('Penalty not found');
      loan.penalty = penalty;
    }

    Object.assign(loan, {
      deliveryCodeHash:
        updateLoanDto.deliveryCodeHash ?? loan.deliveryCodeHash,
      deliveryConfirmedAt: updateLoanDto.deliveryConfirmedAt
        ? new Date(updateLoanDto.deliveryConfirmedAt)
        : loan.deliveryConfirmedAt,
      returnCodeHash: updateLoanDto.returnCodeHash ?? loan.returnCodeHash,
      returnConfirmedAt: updateLoanDto.returnConfirmedAt
        ? new Date(updateLoanDto.returnConfirmedAt)
        : loan.returnConfirmedAt,
      dueDate: updateLoanDto.dueDate ?? loan.dueDate,
      returnedAt: updateLoanDto.returnedAt ?? loan.returnedAt,
      status: updateLoanDto.status ?? loan.status,
    });

    return this.loansRepository.save(loan);
  }

  async remove(id: string) {
    const loan = await this.findOne(id);
    await this.loansRepository.remove(loan);
  }
}
