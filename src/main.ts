import { NestFactory } from '@nestjs/core';
import * as crypto from 'crypto';
// 全局声明crypto，使其在整个应用中可用
(global as any).crypto = crypto;
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
