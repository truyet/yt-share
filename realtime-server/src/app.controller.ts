import { Body, Controller, Logger, Post } from '@nestjs/common';
import { EventsGateway } from './events/events.gateway';

@Controller('/realtime')
export class AppController {
  constructor(private eventGateway: EventsGateway) {}

  @Post('/share')
  async newPost(@Body() data: any) {
    Logger.log('share post', JSON.stringify(data));
    return this.eventGateway.newPost(JSON.stringify(data));
  }
}
