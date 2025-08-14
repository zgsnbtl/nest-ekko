import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { LogsService } from '../../../logs/logs.service';

// 统一错误响应格式
class ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  ip: string;
}

@Injectable()
@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  constructor(private readonly logsService: LogsService) {}

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 默认状态码和错误信息
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';
    let errorName = 'InternalServerErrorException';

    // 根据异常类型处理
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        // 安全地访问message属性
        errorMessage =
          'message' in (exceptionResponse as Record<string, unknown>)
            ? String((exceptionResponse as Record<string, unknown>).message)
            : exception.message;
        errorName = exception.name;
      } else {
        errorMessage = String(exceptionResponse);
        errorName = exception.name;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
      errorName = exception.name;
    }

    // 获取用户IP地址
    const userIp = request.ip || request.connection.remoteAddress || '';

    // 记录错误日志
    this.logsService.error(
      `[${request.method}] ${request.originalUrl} - IP: ${userIp} - Status: ${statusCode} - Error: ${errorName} - Message: ${errorMessage}`,
      exception instanceof Error ? exception : undefined,
      { controller: 'HttpExceptionFilter', action: 'catch', path: request.originalUrl, ip: userIp }
    );

    // 构建统一错误响应
    const errorResponse: ErrorResponse = {
      statusCode,
      message: errorMessage,
      error: errorName,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      ip: userIp,
    };

    // 返回错误响应
    response.status(statusCode).json(errorResponse);
  }
}
