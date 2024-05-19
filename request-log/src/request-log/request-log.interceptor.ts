import { HttpService } from '@nestjs/axios';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as requestIp from 'request-ip';
import * as iconvLite from 'iconv-lite';

import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  @Inject(HttpService)
  private httpService: HttpService;

  private readonly logger = new Logger(RequestLogInterceptor.name);

  private async ipToCity(ip: string | undefined) {
    if (!ip) {
      return;
    }
    // 这里调用 ip-api 或者 ip2region 获取 ip 对应的城市信息
    const apiURL = `https://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`;
    const response = await this.httpService.axiosRef(apiURL, {
      responseType: 'arraybuffer', // 指定 responseType 为 arraybuffer，也就是二进制的数组
      transformResponse: [
        function (data) {
          // 接口返回的字符集是 gbk，而我们用的是 utf-8，所以需要转换一下(编码是使用gbk，那么解码也需要使用相同的gbk)
          const str = iconvLite.decode(data, 'gbk');
          return JSON.parse(str);
        },
      ],
    });
    return response.data.addr ?? '';
  }
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const userAgent = request.header('user-agent');
    const { ip, method, path } = request;
    const { statusCode } = response;
    const clientIp = requestIp.getClientIp(ip) || ip;
    const city = await this.ipToCity('47.115.36.179');
    // clientIp ::ffff:192.168.1.104
    // 这里的 ::ffff 是 ipv6 地址的意思
    // https://en.wikipedia.org/wiki/IPv6
    console.log('clientIp', clientIp);
    console.log('city', city);

    // 打印下 method、path、ip、user agent，调用的目标 class、handler 等信息。
    this.logger.debug(
      `${method} ${path} ${clientIp} ${userAgent}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        // const { statusCode } = response;
        // const { method, path, ip } = request;
        // 记录下响应的状态码和请求时间还有响应内容
        this.logger.debug(
          `${method} ${path} ${clientIp} ${userAgent}: ${statusCode} ${Date.now() - now}ms`,
        );
        this.logger.debug(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
