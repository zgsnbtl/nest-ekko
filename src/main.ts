import { NestFactory } from '@nestjs/core';
import * as crypto from 'crypto';
// 全局声明crypto，使其在整个应用中可用
(globalThis as any).crypto = crypto;
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 添加全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动移除未在DTO中定义的属性
      forbidNonWhitelisted: true, // 如果存在未在DTO中定义的属性，则抛出错误
      transform: true, // 自动将请求体转换为DTO类实例
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('server.port', 3000);
  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
bootstrap();
