import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AddMyBookDto } from './dto/add-my-book.dto';
import { RequestBookCopyDto } from './dto/request-book-copy.dto';
import { RespondLoanRequestDto } from './dto/respond-loan-request.dto';
import { StudentFlowService } from './student-flow.service';

@ApiTags('student-flow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('students', 'student')
@Controller('student')
export class StudentFlowController {
  constructor(private readonly studentFlowService: StudentFlowService) {}

  @Get('status')
  getStatus(@CurrentUser() user: CurrentUserPayload) {
    return this.studentFlowService.getStatus(user.sub);
  }

  @Get('books')
  getMyBooks(@CurrentUser() user: CurrentUserPayload) {
    return this.studentFlowService.getMyBooks(user.sub);
  }

  @Post('books')
  addMyBook(
    @CurrentUser() user: CurrentUserPayload,
    @Body() addMyBookDto: AddMyBookDto,
  ) {
    return this.studentFlowService.addMyBook(user.sub, addMyBookDto);
  }

  @Get('available-book-copies')
  findAvailableBookCopies(@CurrentUser() user: CurrentUserPayload) {
    return this.studentFlowService.findAvailableBookCopies(user.sub);
  }

  @Post('loan-requests')
  requestBookCopy(
    @CurrentUser() user: CurrentUserPayload,
    @Body() requestBookCopyDto: RequestBookCopyDto,
  ) {
    return this.studentFlowService.requestBookCopy(
      user.sub,
      requestBookCopyDto,
    );
  }

  @Get('loan-requests/received')
  getReceivedRequests(@CurrentUser() user: CurrentUserPayload) {
    return this.studentFlowService.getReceivedRequests(user.sub);
  }

  @Patch('loan-requests/:id/respond')
  respondLoanRequest(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() respondLoanRequestDto: RespondLoanRequestDto,
  ) {
    return this.studentFlowService.respondLoanRequest(
      user.sub,
      id,
      respondLoanRequestDto,
    );
  }

  @Get('penalties')
  getMyPenalties(@CurrentUser() user: CurrentUserPayload) {
    return this.studentFlowService.getMyPenalties(user.sub);
  }

  @Patch('penalties/:id/pay')
  payPenalty(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.studentFlowService.payPenalty(user.sub, id);
  }
}
