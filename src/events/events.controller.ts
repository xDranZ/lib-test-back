import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendTestEventDto } from './dto/send-test-event.dto';
import { EventsService } from './events.service';

@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('test')
  sendTestEvent(
    @CurrentUser() user: CurrentUserPayload,
    @Body() sendTestEventDto: SendTestEventDto,
  ) {
    return this.eventsService.sendTestEvent(user, sendTestEventDto);
  }
}
