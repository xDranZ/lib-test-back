import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { LoanRequestStatus } from '../../common/enums/loan-request-status.enum';

export class CreateLoanRequestDto {
  @ApiProperty({ example: '2f3b27f8-4b0c-4c4a-a337-b0a3de2b6d22' })
  @IsUUID()
  bookCopyId: string;

  @ApiProperty({ example: 'ee8b4b30-07a5-43a0-b3ed-01f529355c78' })
  @IsUUID()
  requesterUserId: string;

  @ApiProperty({ example: 'Hola, me puedes prestar este libro?' })
  @IsString()
  requestMessage: string;

  @ApiPropertyOptional({ example: 'Si, te lo puedo entregar mañana.' })
  @IsOptional()
  @IsString()
  responseMessage?: string;

  @ApiPropertyOptional({
    enum: LoanRequestStatus,
    example: LoanRequestStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(LoanRequestStatus)
  status?: LoanRequestStatus;

  @ApiPropertyOptional({ example: '2026-05-06T20:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  respondedAt?: string;
}
