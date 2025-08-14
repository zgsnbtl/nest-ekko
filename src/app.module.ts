// 导入 NestJS 核心模块和装饰器
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
// 导入应用程序控制器
import { AppController } from './app.controller';
import { TestController } from './test/test.controller';
// 导入应用程序服务
import { AppService } from './app.service';
// 导入自定义配置模块
import { ConfigModule } from './config/config.module';
// 导入 @nestjs/config 提供的 ConfigService
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { LogsModule } from './logs/logs.module';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { LogsMiddleware } from './common/middleware/logs.middleware';
// 导入TypeORM配置工厂函数
import { typeOrmConfigFactory } from './config/typeorm.config';
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
      useFactory: typeOrmConfigFactory,
    }),
    UserModule,
    RolesModule,
    LogsModule,
  ],
  // 注册控制器
  controllers: [AppController, TestController],
  // 注册服务提供者
  providers: [AppService, HttpExceptionFilter],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   /**
//    * 构造函数
//    * @param configService - 注入的配置服务实例
//    */
//   constructor(private readonly configService: ConfigService) {
//     const env = this.configService.get<string>('app.name');
//     const dbHost = this.configService.get<string>('database.host');
//     const dbPort = this.configService.get<number>('database.port');
//     const dbName = this.configService.get<string>('database.database');
//     console.log(`当前应用运行环境: ${env}`);
//     console.log(`数据库配置: 主机=${dbHost}, 端口=${dbPort}, 名称=${dbName}`);
//   }

//   /**
//    * 配置中间件
//    * @param consumer - 中间件消费者
//    */
//   configure(consumer: MiddlewareConsumer) {
//     // 对所有路由应用日志中间件
//     consumer.apply(LogsMiddleware).forRoutes('*');
//   }
// }
