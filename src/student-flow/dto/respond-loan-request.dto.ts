import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { LoanRequestStatus } from '../../common/enums/loan-request-status.enum';

export class RespondLoanRequestDto {
  @ApiProperty({
    enum: [LoanRequestStatus.APPROVED, LoanRequestStatus.REJECTED],
    example: LoanRequestStatus.APPROVED,
  })
  @IsEnum(LoanRequestStatus)
  status: LoanRequestStatus.APPROVED | LoanRequestStatus.REJECTED;

  @ApiPropertyOptional({ example: 'Si, te lo puedo entregar mañana.' })
  @IsOptional()
  @IsString()
  responseMessage?: string;

  @ApiPropertyOptional({ example: '2026-05-20' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: '123456' })
  @IsOptional()
  @IsString()
  deliveryCode?: string;

  @ApiPropertyOptional({ example: '654321' })
  @IsOptional()
  @IsString()
  returnCode?: string;
}
