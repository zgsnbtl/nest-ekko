// 导入 NestJS 核心模块和装饰器
import { Module } from '@nestjs/common';
// 导入应用程序控制器
import { AppController } from './app.controller';
// 导入应用程序服务
import { AppService } from './app.service';
// 导入自定义配置模块
import { ConfigModule } from './config/config.module';
// 导入 @nestjs/config 提供的 ConfigService
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
/**
 * 应用程序主模块
 * 集成所有模块、控制器和服务
 */
@Module({
  // 导入所需模块
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<string>('database.type', 'mysql') as 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('database.synchronize', false),
        autoLoadEntities: true,
        logging: configService.get<boolean>('database.logging', false),
      }),
    }),
  ],
  // 注册控制器
  controllers: [AppController],
  // 注册服务提供者
  providers: [AppService],
})
export class AppModule {
  /**
   * 构造函数
   * @param configService - 注入的配置服务实例
   */
  constructor(private readonly configService: ConfigService) {
    const env = this.configService.get<string>('app.name');
    const dbHost = this.configService.get<string>('database.host');
    const dbPort = this.configService.get<number>('database.port');
    const dbName = this.configService.get<string>('database.database');
    console.log(`当前应用运行环境: ${env}`);
    console.log(`数据库配置: 主机=${dbHost}, 端口=${dbPort}, 名称=${dbName}`);
  }
}
