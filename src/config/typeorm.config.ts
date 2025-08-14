import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * TypeORM 配置工厂函数
 * @param configService - 配置服务实例
 * @returns TypeORM 模块配置选项
 */
export const typeOrmConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME', 'nest'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
  autoLoadEntities: true,
  logging: configService.get<boolean>('DB_LOGGING', false),
});

/**
 * TypeORM 配置键
 */
export const TYPEORM_CONFIG = 'typeorm.config';
