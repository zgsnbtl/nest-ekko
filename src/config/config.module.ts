// 导入 NestJS 核心模块和装饰器
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

// 定义Joi验证模式
const validationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USER: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_NAME: Joi.string().required(),
  DB_URL: Joi.string(),
});

/**
 * 配置模块
 * 使用 @nestjs/config 简化配置管理
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      validationSchema,
    }),
  ],
})
export class ConfigModule {}
