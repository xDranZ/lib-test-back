import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { BookCopyStatus } from '../../common/enums/book-copy-status.enum';

export class CreateBookCopyDto {
  @ApiPropertyOptional({ enum: BookCopyStatus, example: BookCopyStatus.AVAILABLE })
  @IsOptional()
  @IsEnum(BookCopyStatus)
  status?: BookCopyStatus;

  @ApiProperty({ example: '2f3b27f8-4b0c-4c4a-a337-b0a3de2b6d22' })
  @IsUUID()
  bookId: string;

  @ApiPropertyOptional({
    example: 'ee8b4b30-07a5-43a0-b3ed-01f529355c78',
  })
  @IsOptional()
  @IsUUID()
  ownerUserId?: string;
}
