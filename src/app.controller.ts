// 导入 NestJS 控制器相关装饰器
import { Controller, Get } from '@nestjs/common';
// 导入应用服务
import { AppService } from './app.service';
// 导入 @nestjs/config 提供的 ConfigService
import { ConfigService } from '@nestjs/config';
/**
 * 应用程序控制器
 * 处理根路径的 HTTP 请求
 */
@Controller()
export class AppController {
  /**
   * 构造函数
   * @param appService - 注入的 AppService 实例
   * @param configService - 注入的 ConfigService 实例
   */
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 处理 GET 请求，返回问候信息
   * @returns 字符串形式的问候信息
   */
  @Get()
  getHello(): string {
    const dbName = this.configService.get<string>('DB_NAME');
    const dbHost = this.configService.get<string>('DB_HOST');
    const appName = this.configService.get<string>('APP_NAME');
    const dbPort = this.configService.get<number>('DB_PORT');
    console.log('当前应用名称：', appName);
    console.log('数据库名称：', dbName);
    console.log('数据库主机：', dbHost);
    console.log('数据库端口：', dbPort);
    return this.appService.getHello();
  }
}
