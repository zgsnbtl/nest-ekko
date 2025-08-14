import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from './config/config.module';

// 创建一个简单的测试类来验证环境变量加载
class TestConfigService {
  constructor(private configService: ConfigService) {}

  printConfig() {
    console.log('数据库主机:', this.configService.get('DB_HOST'));
    console.log('数据库端口:', this.configService.get('DB_PORT'));
    console.log('数据库用户名:', this.configService.get('DB_USER'));
    console.log('数据库密码:', this.configService.get('DB_PASSWORD'));
    console.log('数据库名称:', this.configService.get('DB_NAME'));
    console.log('数据库URL:', this.configService.get('DB_URL'));
  }
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(ConfigModule);
  const testService = new TestConfigService(app.get(ConfigService));
  testService.printConfig();
  await app.close();
}

bootstrap().catch(err => console.error(err));