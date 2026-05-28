import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Code' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Programming' })
  @IsString()
  genre: string;

  @ApiProperty({ example: 'Robert C. Martin' })
  @IsString()
  author: string;

  @ApiProperty({
    example: 'book-covers/8f4c2f2d-cover.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  coverImageKey?: string;
}
