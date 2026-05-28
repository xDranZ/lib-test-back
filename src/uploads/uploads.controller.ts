import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookCoverUploadUrlDto } from './dto/create-book-cover-upload-url.dto';
import { CreateBookCoverViewUrlDto } from './dto/create-book-cover-view-url.dto';
import { UploadsService } from './uploads.service';

@ApiTags('uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('book-cover/presigned-url')
  createBookCoverUploadUrl(@Body() dto: CreateBookCoverUploadUrlDto) {
    return this.uploadsService.createBookCoverUploadUrl(dto);
  }

  @Post('book-cover/view-url')
  createBookCoverViewUrl(@Body() dto: CreateBookCoverViewUrlDto) {
    return this.uploadsService.createBookCoverViewUrl(dto);
  }
}
