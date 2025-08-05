// 导入 NestJS 核心模块和装饰器
import { Module } from '@nestjs/common';
// 导入 @nestjs/config 模块
import { ConfigModule as NestConfigModule } from '@nestjs/config';
// 导入 YAML 配置文件加载器
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as Joi from 'joi';
// 定义Joi验证模式
const validationSchema = Joi.object({
  app: Joi.object({
    name: Joi.string().required(),
  }),
  database: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().default(3306),
    database: Joi.string().required(),
  }),
});

/**
 * 配置模块
 * 使用 @nestjs/config 简化配置管理
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => {
          // 确定当前环境
          const env = process.env.NODE_ENV || 'development';
          // 构建配置文件路径
          const configPath = path.join(
            __dirname,
            '..',
            '..',
            'config',
            `${env}.yml`,
          );
          // 读取并解析 YAML 配置文件
          const fileContent = fs.readFileSync(configPath, 'utf8');
          let config: Record<string, any>;
          try {
            config = yaml.load(fileContent) as Record<string, any>;
          } catch (error) {
            throw new Error(`Failed to parse YAML configuration: ${error instanceof Error ? error.message : String(error)}`);
          }
          if (typeof config !== 'object' || config === null) {
            throw new Error('Invalid configuration format');
          }

          // 确保配置对象中存在必要的属性
          if (!config.database) {
            config.database = {};
          }

          // 应用Joi验证并获取带有默认值的配置
          const validationResult = validationSchema.validate(config, {
            allowUnknown: true,
            abortEarly: false,
            stripUnknown: false,
          });

          if (validationResult.error) {
            throw new Error(`Configuration validation failed: ${validationResult.error.message}`);
          }

          return validationResult.value as Record<string, any>;
        },
      ],
      // 不需要在这里再次设置validationSchema，因为我们已经在load函数中应用了它
    }),
  ],
})
export class ConfigModule {}
