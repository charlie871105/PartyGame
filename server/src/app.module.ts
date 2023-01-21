import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WsClientModule } from './ws-client/ws-client.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [WsClientModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
