import * as pino from 'pino';
import * as pinoPretty from 'pino-pretty';
import { ConfigService } from '@nestjs/config';

export const createPinoLogger = (configService: ConfigService) => {
  const isDevelopment = configService.get<string>('NODE_ENV') === 'development';
  const logLevel = configService.get<string>('logger.level', 'info');

  const stream = isDevelopment
    ? pinoPretty({
        colorize: true,
        levelFirst: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
      })
    : process.stdout;

  return pino(
    {
      level: logLevel,
      base: {
        pid: false,
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    stream,
  );
};
