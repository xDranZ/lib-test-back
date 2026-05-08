import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePenaltyDto {
  @ApiProperty({ example: 'ee8b4b30-07a5-43a0-b3ed-01f529355c78' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ example: '2026-05-06T20:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @ApiProperty({
    example: 'El usuario tuvo dos devoluciones atrasadas en menos de 3 meses.',
  })
  @IsString()
  reason: string;

  @ApiProperty({ example: 'f4a04f95-a344-460b-9bc9-68cc3ce9623f' })
  @IsUUID()
  penaltyTypeId: string;
}
