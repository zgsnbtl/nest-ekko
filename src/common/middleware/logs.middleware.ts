import { NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogsService } from '../../logs/logs.service';

export class LogsMiddleware implements NestMiddleware {
  constructor(@Inject(LogsService) private readonly logsService: LogsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 记录请求开始时间
    const startTime = Date.now();
    const { method, originalUrl, body, query, params, ip, headers } =
      req as unknown as {
        method: string;
        originalUrl: string;
        body: unknown;
        query: Record<string, unknown>;
        params: Record<string, string>;
        ip: string;
        headers: Record<string, unknown>;
      };

    // 提取请求信息
    const requestInfo = {
      method,
      path: originalUrl,
      body: body as unknown,
      query: query as Record<string, unknown>,
      params: params as Record<string, string>,
      ip,
      userAgent: headers['user-agent'] as string,
    };

    // 继续处理请求
    next();

    // 请求处理完成后记录响应信息
    res.on('finish', () => {
      const endTime = Date.now();
      const { statusCode, statusMessage } = res;

      // 记录响应信息
      const responseInfo = {
        statusCode,
        statusMessage,
        responseTime: endTime - startTime,
      };

      // 组合日志信息
      const logMessage = `Request: ${method} ${originalUrl} - Status: ${statusCode}`;
      const logContext = {
        request: requestInfo,
        response: responseInfo,
      };

      // 使用日志服务记录信息
      this.logsService.info(logMessage, logContext).catch((error) => {
        console.error('Failed to save log to database:', error);
      });
    });
  }
}
