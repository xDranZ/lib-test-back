import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';
import { UpdateLoanRequestDto } from './dto/update-loan-request.dto';
import { LoanRequestsService } from './loan-requests.service';

@ApiTags('loan-requests')
@Controller('loan-requests')
export class LoanRequestsController {
  constructor(private readonly loanRequestsService: LoanRequestsService) {}

  @Post()
  create(@Body() createLoanRequestDto: CreateLoanRequestDto) {
    return this.loanRequestsService.create(createLoanRequestDto);
  }

  @Get()
  findAll() {
    return this.loanRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loanRequestsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLoanRequestDto: UpdateLoanRequestDto,
  ) {
    return this.loanRequestsService.update(id, updateLoanRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loanRequestsService.remove(id);
  }
}
