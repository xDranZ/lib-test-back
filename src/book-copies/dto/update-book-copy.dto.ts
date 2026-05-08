import { PartialType } from '@nestjs/mapped-types';
import { CreateBookCopyDto } from './create-book-copy.dto';

export class UpdateBookCopyDto extends PartialType(CreateBookCopyDto) {}
