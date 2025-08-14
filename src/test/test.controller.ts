import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('exception')
  throwException() {
    throw new HttpException('这是一个测试异常', HttpStatus.BAD_REQUEST);
  }

  @Get('error')
  throwError() {
    throw new Error('这是一个普通错误');
  }

  @Get('not-found')
  throwNotFound() {
    throw new HttpException('资源不存在', HttpStatus.NOT_FOUND);
  }
}
