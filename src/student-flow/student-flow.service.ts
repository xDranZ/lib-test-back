import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { BookCopy } from '../book-copies/entities/book-copy.entity';
import { Book } from '../books/entities/book.entity';
import { BookCopyStatus } from '../common/enums/book-copy-status.enum';
import { LoanRequestStatus } from '../common/enums/loan-request-status.enum';
import { LoanStatus } from '../common/enums/loan-status.enum';
import { hashPassword } from '../auth/password-hasher';
import { LoanRequest } from '../loan-requests/entities/loan-request.entity';
import { Loan } from '../loans/entities/loan.entity';
import { Penalty } from '../penalties/entities/penalty.entity';
import { User } from '../users/entities/user.entity';
import { AddMyBookDto } from './dto/add-my-book.dto';
import { RequestBookCopyDto } from './dto/request-book-copy.dto';
import { RespondLoanRequestDto } from './dto/respond-loan-request.dto';

@Injectable()
export class StudentFlowService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    @InjectRepository(BookCopy)
    private readonly bookCopiesRepository: Repository<BookCopy>,
    @InjectRepository(LoanRequest)
    private readonly loanRequestsRepository: Repository<LoanRequest>,
    @InjectRepository(Loan)
    private readonly loansRepository: Repository<Loan>,
    @InjectRepository(Penalty)
    private readonly penaltiesRepository: Repository<Penalty>,
  ) {}

  async getStatus(userId: string) {
    const user = await this.getUser(userId);
    const pendingPenaltiesCount = await this.penaltiesRepository.count({
      where: { user: { id: userId }, paidAt: IsNull() },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
      blocked: pendingPenaltiesCount > 0,
      reason: pendingPenaltiesCount > 0 ? 'pending_penalties' : null,
      pendingPenaltiesCount,
    };
  }

  async getMyBooks(userId: string) {
    await this.ensureUserIsNotBlocked(userId);

    return this.bookCopiesRepository.find({
      where: { ownerUser: { id: userId } },
      relations: { book: true, ownerUser: true },
      order: { createdAt: 'DESC' },
    });
  }

  async addMyBook(userId: string, addMyBookDto: AddMyBookDto) {
    await this.ensureUserIsNotBlocked(userId);

    const ownerUser = await this.getUser(userId);
    const book = await this.booksRepository.save(
      this.booksRepository.create(addMyBookDto),
    );

    return this.bookCopiesRepository.save(
      this.bookCopiesRepository.create({
        book,
        ownerUser,
        status: BookCopyStatus.AVAILABLE,
      }),
    );
  }

  async findAvailableBookCopies(userId: string) {
    await this.ensureUserIsNotBlocked(userId);

    return this.bookCopiesRepository.find({
      where: {
        status: BookCopyStatus.AVAILABLE,
        ownerUser: { id: Not(userId) },
      },
      relations: { book: true, ownerUser: true },
      order: { createdAt: 'DESC' },
    });
  }

  async requestBookCopy(userId: string, requestBookCopyDto: RequestBookCopyDto) {
    await this.ensureUserIsNotBlocked(userId);

    const [requesterUser, bookCopy] = await Promise.all([
      this.getUser(userId),
      this.bookCopiesRepository.findOne({
        where: { id: requestBookCopyDto.bookCopyId },
        relations: { book: true, ownerUser: true },
      }),
    ]);

    if (!bookCopy) throw new NotFoundException('Book copy not found');
    if (bookCopy.ownerUser?.id === userId) {
      throw new BadRequestException('You cannot request your own book');
    }
    if (bookCopy.status !== BookCopyStatus.AVAILABLE) {
      throw new BadRequestException('Book copy is not available');
    }

    const existingPendingRequest = await this.loanRequestsRepository.findOne({
      where: {
        bookCopy: { id: bookCopy.id },
        requesterUser: { id: userId },
        status: LoanRequestStatus.PENDING,
      },
    });
    if (existingPendingRequest) {
      throw new BadRequestException('You already have a pending request');
    }

    return this.loanRequestsRepository.save(
      this.loanRequestsRepository.create({
        bookCopy,
        requesterUser,
        requestMessage: requestBookCopyDto.requestMessage,
        status: LoanRequestStatus.PENDING,
      }),
    );
  }

  async getReceivedRequests(userId: string) {
    await this.ensureUserIsNotBlocked(userId);

    return this.loanRequestsRepository.find({
      where: { bookCopy: { ownerUser: { id: userId } } },
      relations: {
        requesterUser: true,
        bookCopy: { book: true, ownerUser: true },
      },
      order: { requestedAt: 'DESC' },
    });
  }

  async respondLoanRequest(
    userId: string,
    requestId: string,
    respondLoanRequestDto: RespondLoanRequestDto,
  ) {
    await this.ensureUserIsNotBlocked(userId);

    const loanRequest = await this.loanRequestsRepository.findOne({
      where: { id: requestId },
      relations: {
        requesterUser: true,
        bookCopy: { book: true, ownerUser: true },
      },
    });

    if (!loanRequest) throw new NotFoundException('Loan request not found');
    if (loanRequest.bookCopy.ownerUser?.id !== userId) {
      throw new ForbiddenException('You cannot respond this request');
    }
    if (loanRequest.status !== LoanRequestStatus.PENDING) {
      throw new BadRequestException('Loan request is not pending');
    }

    loanRequest.status = respondLoanRequestDto.status;
    loanRequest.responseMessage = respondLoanRequestDto.responseMessage;
    loanRequest.respondedAt = new Date();

    if (respondLoanRequestDto.status === LoanRequestStatus.REJECTED) {
      return this.loanRequestsRepository.save(loanRequest);
    }

    if (!respondLoanRequestDto.dueDate || !respondLoanRequestDto.deliveryCode) {
      throw new BadRequestException(
        'dueDate and deliveryCode are required to approve a request',
      );
    }
    if (loanRequest.bookCopy.status !== BookCopyStatus.AVAILABLE) {
      throw new BadRequestException('Book copy is not available');
    }

    const loan = this.loansRepository.create({
      bookCopy: loanRequest.bookCopy,
      borrowerUser: loanRequest.requesterUser,
      loanRequest,
      deliveryCodeHash: await hashPassword(respondLoanRequestDto.deliveryCode),
      returnCodeHash: respondLoanRequestDto.returnCode
        ? await hashPassword(respondLoanRequestDto.returnCode)
        : undefined,
      dueDate: respondLoanRequestDto.dueDate,
      status: LoanStatus.ACTIVE,
    });
    loanRequest.bookCopy.status = BookCopyStatus.LOANED;

    await this.loanRequestsRepository.save(loanRequest);
    await this.bookCopiesRepository.save(loanRequest.bookCopy);

    return this.loansRepository.save(loan);
  }

  async getMyPenalties(userId: string) {
    return this.penaltiesRepository.find({
      where: { user: { id: userId } },
      relations: { penaltyType: true, loans: { bookCopy: { book: true } } },
      order: { createdAt: 'DESC' },
    });
  }

  async payPenalty(userId: string, penaltyId: string) {
    const penalty = await this.penaltiesRepository.findOne({
      where: { id: penaltyId, user: { id: userId } },
      relations: { penaltyType: true },
    });
    if (!penalty) throw new NotFoundException('Penalty not found');
    if (penalty.paidAt) throw new BadRequestException('Penalty already paid');

    penalty.paidAt = new Date();

    return this.penaltiesRepository.save(penalty);
  }

  private async ensureUserIsNotBlocked(userId: string) {
    const pendingPenaltiesCount = await this.penaltiesRepository.count({
      where: { user: { id: userId }, paidAt: IsNull() },
    });

    if (pendingPenaltiesCount > 0) {
      throw new ForbiddenException('User has pending penalties');
    }
  }

  private async getUser(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
