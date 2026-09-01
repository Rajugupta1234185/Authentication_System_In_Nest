import { Params } from 'nestjs-pino';
import { IncomingMessage, ServerResponse } from 'http';
import * as FileStreamRotator from 'file-stream-rotator';
import * as path from 'path';
import * as fs from 'fs';
import { multistream } from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
const logsDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getProductionStream = () => {
  const appStream = FileStreamRotator.getStream({
    filename: path.join(logsDir, 'app-%DATE%.log'),
    frequency: 'daily',
    size: '10m',
    max_logs: '14d',
    date_format: 'YYYY-MM-DD',
    utc: true,
  });

  const errorStream = fs.createWriteStream(path.join(logsDir, 'errors.log'), {
    flags: 'a',
  });

  return multistream([
    { stream: appStream, level: 'info' },
    { stream: errorStream, level: 'error' },
  ]);
};

export const loggerConfig: Params = {
  pinoHttp: {
    level: isProduction ? 'info' : 'debug',
    ...(isProduction
      ? { stream: getProductionStream() }
      : {
          transport: {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        }),
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.body.password',
        'req.body.confirmPassword',
        'res.headers.set-cookie',
      ],
      remove: true,
    },
    autoLogging: {
      ignore: (req: IncomingMessage) =>
        ['/health', '/favicon.ico'].includes(req.url ?? ''),
    },
    customLogLevel: (
      req: IncomingMessage,
      res: ServerResponse,
      err?: Error,
    ) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req: IncomingMessage) =>
      `request completed: ${req.method} ${req.url}`,
    customErrorMessage: (req: IncomingMessage, res: ServerResponse) =>
      `request failed: ${req.method} ${req.url} ${res.statusCode}`,
  },
};
