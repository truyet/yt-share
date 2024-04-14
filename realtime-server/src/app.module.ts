import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { EventsGateway } from './events/events.gateway';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EventsModule],
  controllers: [AppController],
  providers: [EventsGateway],
})
export class AppModule {}
