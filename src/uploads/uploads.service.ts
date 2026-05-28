import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { CreateBookCoverUploadUrlDto } from './dto/create-book-cover-upload-url.dto';
import { CreateBookCoverViewUrlDto } from './dto/create-book-cover-view-url.dto';

@Injectable()
export class UploadsService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
    });
  }

  async createBookCoverUploadUrl(dto: CreateBookCoverUploadUrlDto) {
    const bucket = this.configService.get<string>('S3_BUCKET_NAME');
    if (!bucket) {
      throw new BadRequestException('S3 bucket is not configured');
    }

    const safeFileName = this.sanitizeFileName(dto.fileName);
    const key = `book-covers/${randomUUID()}-${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: dto.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });

    return {
      uploadUrl,
      key,
      expiresInSeconds: 300,
    };
  }

  async createBookCoverViewUrl(dto: CreateBookCoverViewUrlDto) {
    const bucket = this.configService.get<string>('S3_BUCKET_NAME');
    if (!bucket) {
      throw new BadRequestException('S3 bucket is not configured');
    }

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: dto.key,
    });

    const viewUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });

    return {
      viewUrl,
      expiresInSeconds: 300,
    };
  }

  private sanitizeFileName(fileName: string) {
    const normalized = fileName.trim().toLowerCase();
    const safe = normalized.replace(/[^a-z0-9._-]/g, '-');
    return safe || 'book-cover';
  }
}
