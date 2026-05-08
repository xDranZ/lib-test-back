import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddMyBookDto {
  @ApiProperty({ example: 'Clean Code' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Programming' })
  @IsString()
  genre: string;

  @ApiProperty({ example: 'Robert C. Martin' })
  @IsString()
  author: string;
}
