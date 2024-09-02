import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebSocketsGateway } from './gateways/web-sockets/web-sockets.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WebSocketsGateway],
})
export class AppModule {}
