import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength } from 'class-validator';

export class CreateBookCoverUploadUrlDto {
  @ApiProperty({ example: 'clean-code.png' })
  @IsString()
  @MaxLength(120)
  fileName: string;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  @Matches(/^image\/(png|jpeg|webp)$/)
  contentType: string;
}
