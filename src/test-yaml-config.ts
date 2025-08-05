// 导入 NestJS 核心工厂
import { NestFactory } from '@nestjs/core';
// 导入应用主模块
import { AppModule } from './app.module';
// 导入 @nestjs/config 提供的 ConfigService
import { ConfigService } from '@nestjs/config';

/**
 * 引导函数
 * 创建应用上下文并测试 YAML 配置加载
 */
async function bootstrap() {
  // 创建应用上下文（非 HTTP 服务器模式）
  const app = await NestFactory.createApplicationContext(AppModule);
  // 获取配置服务实例
  const configService = app.get(ConfigService);

  // 打印配置测试标题
  console.log('===== YAML 配置测试 =====');
  // 打印应用配置
  console.log('应用名称:', configService.get('app.name'));
  console.log('应用调试模式:', configService.get('app.debug'));
  // 打印服务器配置
  console.log('服务器端口:', configService.get('server.port'));
  // 打印数据库配置
  console.log('数据库类型:', configService.get('database.type'));
  console.log('数据库名称:', configService.get('database.database'));
  // 打印当前环境
  console.log('当前环境:', process.env.NODE_ENV || 'development');
  console.log('========================');

  await app.close();
}

bootstrap();
