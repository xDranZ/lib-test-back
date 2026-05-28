import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateBookCoverViewUrlDto {
  @ApiProperty({ example: 'book-covers/8f4c2f2d-cover.png' })
  @IsString()
  @Matches(/^book-covers\/[a-zA-Z0-9._-]+$/)
  key: string;
}
