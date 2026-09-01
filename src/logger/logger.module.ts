import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from '../config/logger.config';
import { AppLogger } from './logger.service';

@Global()
@Module({
  imports: [LoggerModule.forRoot(loggerConfig)],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class AppLoggerModule {}
