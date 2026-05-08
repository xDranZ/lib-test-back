import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class RequestBookCopyDto {
  @ApiProperty({ example: '2f3b27f8-4b0c-4c4a-a337-b0a3de2b6d22' })
  @IsUUID()
  bookCopyId: string;

  @ApiProperty({ example: 'Hola, me puedes prestar este libro?' })
  @IsString()
  requestMessage: string;
}
