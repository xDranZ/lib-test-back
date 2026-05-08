import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreatePenaltyTypeDto {
  @ApiProperty({ example: 'Late return' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Multa por devolver tarde un libro.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '5000' })
  @IsNumberString()
  defaultAmount: string;
}
