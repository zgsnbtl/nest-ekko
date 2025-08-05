// 导入必要的装饰器
import { Injectable } from '@nestjs/common';

/**
 * 应用程序服务
 * 提供核心业务逻辑和数据处理功能
 */
@Injectable()
export class AppService {
  /**
   * 获取问候信息
   * @returns 字符串形式的问候信息
   */
  getHello(): string {
    return 'Hello World!';
  }
}
