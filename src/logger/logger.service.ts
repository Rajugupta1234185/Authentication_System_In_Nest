import { Injectable, LoggerService } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppLogger implements LoggerService {
  constructor(private readonly logger: PinoLogger) {}

  setContext(context: string): this {
    this.logger.setContext(context);
    return this;
  }

  log(message: unknown, context?: string): void {
    if (context) this.logger.setContext(context);
    this.logger.info(message as object);
  }

  error(message: unknown, trace?: string, context?: string): void {
    if (context) this.logger.setContext(context);
    this.logger.error({ message, trace } as object);
  }

  warn(message: unknown, context?: string): void {
    if (context) this.logger.setContext(context);
    this.logger.warn(message as object);
  }

  debug(message: unknown, context?: string): void {
    if (context) this.logger.setContext(context);
    this.logger.debug(message as object);
  }

  verbose(message: unknown, context?: string): void {
    if (context) this.logger.setContext(context);
    this.logger.trace(message as object);
  }
}
