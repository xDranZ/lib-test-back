import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SendTestEventDto {
  @ApiProperty({ example: 'hola mundo desde Nest', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
