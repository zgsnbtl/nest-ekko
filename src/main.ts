import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as crypto from 'crypto';
// 全局声明crypto，使其在整个应用中可用
// 添加类型安全的声明
declare global {
  interface Global {
    crypto: typeof crypto;
  }
}

(globalThis as unknown as Global).crypto = crypto;
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // 添加全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动移除未在DTO中定义的属性
      forbidNonWhitelisted: true, // 如果存在未在DTO中定义的属性，则抛出错误
      transform: true, // 自动将请求体转换为DTO类实例
    }),
  );

  // 注册全局异常过滤器（通过依赖注入）
  app.useGlobalFilters(app.get(HttpExceptionFilter));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT', 3000);
  app.setGlobalPrefix('api');
  // 确保导入 Logger 并指定类型
  const logger = new Logger();
  await app.listen(port);
  logger.warn(`Application running on port============= ${port}`);
}
bootstrap();
