import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { LoanStatus } from '../../common/enums/loan-status.enum';

export class CreateLoanDto {
  @ApiProperty({ example: '2f3b27f8-4b0c-4c4a-a337-b0a3de2b6d22' })
  @IsUUID()
  bookCopyId: string;

  @ApiProperty({ example: 'ee8b4b30-07a5-43a0-b3ed-01f529355c78' })
  @IsUUID()
  borrowerUserId: string;

  @ApiPropertyOptional({
    example: 'f398a92b-f389-48da-9388-c97ad519786f',
  })
  @IsOptional()
  @IsUUID()
  loanRequestId?: string;

  @ApiPropertyOptional({
    example: '7b6dfad0-fbe7-4938-98a5-ebf7535f8464',
  })
  @IsOptional()
  @IsUUID()
  penaltyId?: string;

  @ApiProperty({ example: '$2b$10$deliveryHash' })
  @IsString()
  deliveryCodeHash: string;

  @ApiPropertyOptional({ example: '2026-05-06T20:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  deliveryConfirmedAt?: string;

  @ApiPropertyOptional({ example: '$2b$10$returnHash' })
  @IsOptional()
  @IsString()
  returnCodeHash?: string;

  @ApiPropertyOptional({ example: '2026-05-10T20:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  returnConfirmedAt?: string;

  @ApiProperty({ example: '2026-05-20' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ example: '2026-05-19T18:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  returnedAt?: string;

  @ApiPropertyOptional({ enum: LoanStatus, example: LoanStatus.ACTIVE })
  @IsOptional()
  @IsEnum(LoanStatus)
  status?: LoanStatus;
}
