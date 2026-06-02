import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { SendTestEventDto } from './dto/send-test-event.dto';

@Injectable()
export class EventsService {
  private readonly sqsClient: SQSClient;

  constructor(private readonly configService: ConfigService) {
    this.sqsClient = new SQSClient({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
    });
  }

  async sendTestEvent(user: CurrentUserPayload, dto: SendTestEventDto) {
    const queueUrl = this.configService.get<string>('SQS_EVENTS_QUEUE_URL');
    if (!queueUrl) {
      throw new BadRequestException('SQS events queue is not configured');
    }

    const payload = {
      type: 'test_event',
      message: dto.message ?? 'hola mundo desde Nest',
      user: {
        id: user.sub,
        email: user.email,
        role: user.role,
      },
      createdAt: new Date().toISOString(),
    };

    const result = await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(payload),
      }),
    );

    return {
      messageId: result.MessageId,
      payload,
    };
  }
}
